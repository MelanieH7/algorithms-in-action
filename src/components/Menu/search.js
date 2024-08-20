import React, {
    useContext, useState, useEffect, useRef,
} from 'react'
import searchAlgorithm from '../left-panel/index'

function searchBar() {

    return (
        <div>
            <div class='formContainer'>
                <input
                    className="searchInput"
                    placeholder="Search..."
                    data-testid="searchInput"
                    onChange={searchAlgorithm}>
                </input>
            </div>
            <div class="resultsContainer"></div>
        </div>
    );
}

export default searchBar