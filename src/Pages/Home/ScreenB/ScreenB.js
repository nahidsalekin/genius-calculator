import '../Screen.css'
import React, { useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";

const ScreenB = ({ setContent, handleShow, results }) => {
    const [hasMore, sethasMore] = useState(true);
    const [page, setPage] = useState(7);
    const [data, setData] = useState([]);
    console.log(results);
    useEffect(() => {
        if (results.length > 6)
            setData([...results.slice(0, page)]);
        else
            setData(results);
        if (page === results.length) {
            sethasMore(false);
            return;
        }
        else
            sethasMore(true)

    }, [results, page])

    const showInput = inputContent => {
        setContent(inputContent);
        handleShow();
    }
    const nextData = () => setPage(page + 1);

    return (
        <div className="screen-container">
            <InfiniteScroll
                dataLength={data.length}
                next={nextData}
                hasMore={hasMore}
                height={600}
                loader={<h4>Loading...</h4>}
                endMessage={<p style={{ textAlign: "center" }}>
                    <b>All results revealed.</b>
                </p>}
                className="results-container screen-b p-2"
            >
                <h5 className="fw-bold">Total Results: {results.length}</h5>
                <div className="results mt-3">
                    {
                        data.map((result, index) => <div key={`key-${index}`} className="result mb-3 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <span>= {result.result}</span>
                                <h6 className="mb-0 ms-3">{result.title}</h6>
                            </div>
                            <button className="btn rounded-pill px-4"
                                onClick={() => showInput(result.input)}>See Input</button>
                        </div>
                        )}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ScreenB;