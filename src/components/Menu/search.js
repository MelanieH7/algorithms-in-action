import React, {
    useContext, useState, useEffect, useRef,
} from 'react'
import searchAlgorithm from '../left-panel/index'
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';

function searchBar() {
    //const { dispatch, algorithm } = useContext(GlobalContext);
    const [displaySearch, setDisplaySearch] = useState(null);

    return (
        <div>
            <div className='formContainer'> {/* this div holds the searchbar */}
                <input
                    className="searchInput"
                    placeholder="Search..."
                    data-testid="searchInput"
                    onChange={searchAlgorithm}>
                </input>
            </div>
            <div className="resultsContainer"> {/* this div will hold the results (if any) */}
                {
                    (displaySearch === null)
                        ? <div></div> //empty div if there are no search results

                        : displaySearch.map((algo) => (
                            <button
                                key={algo.id}
                                type="button"
                                className='algoItem active'
                                onClick={() => {
                                    history.push('/'); // won't take us to the specific algorithm yet
                                }}
                            >
                                <div className="algoItemContent">{algo.name}</div>
                                <script> console.log(algo) </script>
                            </button>
                        ))
                }
            </div>
        </div>
    );
}

export default searchBar