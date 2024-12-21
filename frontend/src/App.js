import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ImageGallery from './components/ImageGallery';
import ImageDetails from './components/ImageDetails';
import Search from './components/Search';
import Favourites from './components/Favourites';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/search" component={Search} />
                <Route path="/favourites" component={Favourites} />
                <Route path="/login" component={Login} />
                <Route path="/images/:id" component={ImageDetails} />
                <Route path="/" component={ImageGallery} />
            </Switch>
        </Router>
    );
}

export default App;