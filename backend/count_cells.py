import numpy as np
import psycopg2
from pathlib import Path
import sys

def count_cells(npy_path):
    """
    Count the number of unique cell masks in a .npy segmentation file.
    """
    try:
        # Load the .npy file with allow_pickle=True
        seg_data = np.load(npy_path, allow_pickle=True).item()

        # Access the 'masks' key
        if 'masks' in seg_data:
            masks = seg_data['masks']
        else:
            print(f"'masks' key not found in {npy_path}")
            return None

        # Count unique cells (excluding background, which is 0)
        unique_cells = np.unique(masks)
        cell_count = len(unique_cells) - (1 if 0 in unique_cells else 0)
        return cell_count
    except Exception as e:
        print(f"Error loading or processing npy file: {e}")
        return None

def update_database(file_name, cell_count):
    """
    Update the images table in the database with the cell count.
    """
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="123456",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()

        # Update the database
        update_query = """
            UPDATE images
            SET numbercells = %s
            WHERE filepath = %s;
        """
        cursor.execute(update_query, (cell_count, file_name))
        conn.commit()
        print(f"Updated database for {file_name} with {cell_count} cells.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error updating database: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python count_cells.py <seg.npy>")
        sys.exit(1)

    npy_path = Path(sys.argv[1])
    if not npy_path.exists():
        print(f"File not found: {npy_path}")
        sys.exit(1)

    # Extract the filename without extension
    file_name = npy_path.stem + ".jpg"  # Assuming the original uploaded file is .jpg

    # Count cells
    cell_count = count_cells(npy_path)
    if cell_count is not None:
        # Update the database
        update_database(file_name, cell_count)
