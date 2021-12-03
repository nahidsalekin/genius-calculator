import React, { useEffect, useState } from 'react';
import ScreenA from './ScreenA/ScreenA';
import ScreenB from './ScreenB/ScreenB';
import ShowInput from './ShowInput/ShowInput';
import socketIOClient from "socket.io-client";
import ProgressModal from './ProgressModal/ProgressModal';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const ENDPOINT = "https://frozen-island-64039.herokuapp.com";

const Home = () => {
    let location = useLocation();
    let socket = socketIOClient(ENDPOINT);
    const [results, setResults] = useState([]);
    const [show, setShow] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [content, setContent] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [processing, setProcessing] = useState(false);

    const getData = () => {
        fetch('https://frozen-island-64039.herokuapp.com/results')
            .then(res => res.json())
            .then(data => {
                setResults(data.allResults);
            });
    }
    useEffect(() => {
        socket.on('connection', () => {
            console.log(`I'm connected with the back-end`);
            getData();
        });

        socket.on('result', (data) => {
            setResults(results => [...results, data]);
            setProcessing(false);
        });

        socket.on('allResults', data => {
            setResults(data[0].allResults);
            setUpdating(false)
        });

    }, [])

    return (
        <div>
            <div className="d-flex justify-content-center screens">
                {location.pathname !== '/screenB' ?
                    <div>
                        <div className="d-flex justify-content-between align-items-start">
                            <h4 style={{ color: '#ff5722' }}>Screen A</h4>
                            <Link className="btn btn-sm btn-outline-secondary" to="/screenB">Open Screen B</Link>
                        </div>
                        <ScreenA
                            results={results}
                            setResults={setResults}
                            show={show}
                            handleClose={handleClose}
                            handleShow={handleShow}
                            setContent={setContent}
                            socket={socket}
                            processing={processing}
                            setProcessing={setProcessing}
                            setUpdating={setUpdating}
                        ></ScreenA>
                    </div>
                    :
                    <div>
                        <div className="d-flex justify-content-between align-items-start">
                            <h4 style={{ color: '#ff5722' }}>Screen B</h4>
                            <Link className="btn btn-sm btn-outline-secondary" to="/screenA">Open Screen A</Link>
                        </div>
                        <ScreenB
                            results={results}
                            show={show}
                            handleClose={handleClose}
                            handleShow={handleShow}
                            setContent={setContent}
                        ></ScreenB>
                    </div>
                }
            </div>

            <ShowInput
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                content={content}
            ></ShowInput>

            <ProgressModal
                updating={updating}
            ></ProgressModal>
        </div>
    );
};

export default Home;