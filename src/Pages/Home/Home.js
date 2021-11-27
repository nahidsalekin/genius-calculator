import React, { useState } from 'react';
import ScreenA from './ScreenA/ScreenA';
import ScreenB from './ScreenB/ScreenB';
import ShowInput from './ShowInput/ShowInput';

const Home = () => {
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div>
            <div className="d-flex justify-content-around">
                <div>
                    <h4 className="ps-3">Screen A</h4>
                    <ScreenA
                        show={show}
                        handleClose={handleClose}
                        handleShow={handleShow}
                        setContent={setContent}
                    ></ScreenA>
                </div>
                <div>
                    <h4 className="ps-3">Screen B</h4>
                    <ScreenB
                        show={show}
                        handleClose={handleClose}
                        handleShow={handleShow}
                        setContent={setContent}
                    ></ScreenB>
                </div>
            </div>

            <ShowInput
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                content={content}
            ></ShowInput>
        </div>
    );
};

export default Home;