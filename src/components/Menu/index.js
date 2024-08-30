import '../../styles/Menu.scss';
import React from 'react';
import Header from '../top/Header';
import Search from './search'
import { AlgorithmCategoryList, AlgorithmList } from '../../algorithms';

const Menu = () => {
    return (
        <div className="background">
            <div id="header"><Header></Header></div>
            <div className="title"> Algorithms in Action</div>
            <div className="searchBar"><Search></Search></div>
        </div>
    );
};

export default Menu