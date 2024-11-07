import React, { useState, useEffect } from "react";
import tutorialDataService from "../services/tutorial.service";
import { Link } from "react-router-dom";
import Pagination from '@mui/material/Pagination';

const TutorialsList = () => {
    const [tutorials, setTutorials] = useState([]);
    const [currentTutorial, setCurrentTutorial] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchTitle, setSearchTitle] = useState("");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(3);

    const pageSizes = [3, 6, 9];
  
    useEffect(() => {
      retrieveTutorials();
    }, [page, pageSize]);
  
    const onChangeSearchTitle = e => {
      const searchTitle = e.target.value;
      setSearchTitle(searchTitle);
    };

    const getRequestParams = (searchTitle, page, pageSize) => {
      let params = {};

      if (searchTitle) {
        params["title"] = searchTitle;
      }

      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      return params;
    };
  
    const retrieveTutorials = () => {
      const params = getRequestParams(searchTitle, page, pageSize);

      tutorialDataService.getAll(params)
        .then(response => {
          // Check if response.data is an array (API v1)
          let normalizedData;
          if (Array.isArray(response.data)) {
            // Format the data to not break the pagination component
            let data = {
              currentPage: 0,
              totalItems: response.data.length,
              totalPages: 1, // since all the data is fetched as whole, display everything
              tutorials: response.data
            }
          
            setTutorials(data.tutorials);
            setCount(data.totalPages);
            setPageSize(data.totalItems);
            // If API v1, assign data directly
            // normalizedData = response.data;
          } else if (response.data.tutorials) {
            const { tutorials, totalPages } = response.data;
            // console.log(response.data);
            setTutorials(tutorials);
            setCount(totalPages);
            // If API v2, retrieve tutorials array from the object
            // normalizedData = response.data.tutorials;
          } else {
            throw new Error("Unexpected API response format");
          }

          // Set normalized data to tutorials
          // setTutorials(normalizedData);
        })
        .catch(e => {
          console.log(e);
        });
    };

    const handlePageChange = (event, value) => {
      setPage(value);
    };

    const handlePageSizeChange = (event) => {
      setPageSize(event.target.value);
      setPage(1);
    };
  
    const refreshList = () => {
      retrieveTutorials();
      setCurrentTutorial(null);
      setCurrentIndex(-1);
    };
  
    const setActiveTutorial = (tutorial, index) => {
      setCurrentTutorial(tutorial);
      setCurrentIndex(index);
    };
  
    const removeAllTutorials = () => {
      tutorialDataService.removeAll()
        .then(response => {
          console.log(response.data);
          refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    };
  
    const findByTitle = () => {
      tutorialDataService.findByTitle(searchTitle)
        .then(response => {
          setTutorials(response.data);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    };
  
    return (
        <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Tutorials List</h4>
  
          {/* <ul className="list-group">
            {tutorials &&
              tutorials.map((tutorial, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveTutorial(tutorial, index)}
                  key={index}
                >
                  {tutorial.title}
                </li>
              ))}
          </ul> */}

          <div className="mt-3">
            {"Items per Page: "}
            <select onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <Pagination 
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={handlePageChange}
            />
          </div>

          <ul className="list-group">
            {tutorials && 
              tutorials.map((tutorial, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : " ")
                  }
                  onClick={() => setActiveTutorial(tutorial, index)}
                  key={index}>
                    {tutorial.title}
                  </li>
              ))}
          </ul>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={removeAllTutorials}
            disabled
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentTutorial ? (
            <div>
              <h4>Tutorial</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentTutorial.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentTutorial.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentTutorial.published ? "Published" : "Pending"}
              </div>
  
              <Link
                to={"/tutorials/" + currentTutorial.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Tutorial...</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default TutorialsList;