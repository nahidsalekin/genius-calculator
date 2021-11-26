import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsCardImage } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './ScreenA.css'
const ScreenA = () => {
    const [results, setResults] = useState([1, 2, 3, 4, 5]);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [calcTitle, setCalcTitle] = useState('');
    const [fileContent, setFileContent] = useState('');

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));
    function calculateInput(fn) {
        return new Function('return ' + fn)();
    }
    const handleSubmission = e => {

        e.preventDefault();
        console.log(calcTitle, fileContent);
        console.log(calculateInput(fileContent))
    }
    let fileReader;

    const handleFileRead = (e) => {
        setFileContent(fileReader.result);
        console.log(fileContent)
        // … do something with the 'content' …
    };

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(results);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setResults(items);
    }
    return (
        <div className="screen-container">
            <div className="results-container p-2">
                <h5 className="fw-bold">Total Results: {results.length}</h5>

                <div className="results mt-3">

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                            {(provided => (
                                <div className="characters" {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                    {
                                        results.map((result, index) => <Draggable key={index + 1}
                                            draggableId={`${index}-1`} index={index}
                                        >
                                            {(provided) => (
                                                <div {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    className="result mb-3 d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <span>= 24</span>
                                                        <h6 className="mb-0 ms-3">calculation title {result}</h6>
                                                    </div>
                                                    <button className="btn rounded-pill px-4">See Input</button>
                                                </div>
                                            )

                                            }
                                        </Draggable>)
                                    }
                                </div>
                            )
                            )}
                        </Droppable>

                    </DragDropContext>

                </div>

            </div>
            <div className="input-container p-2">
                <h5 className="fw-bold">Input</h5>

                <form onSubmit={handleSubmission} className="inputs mt-2">
                    <input type="text" className="form-control"
                        onChange={e => setCalcTitle(e.target.value)}
                        required placeholder="Calculation Title" />

                    <div {...getRootProps({ className: 'dropzone' })}
                        className="my-2 p-2 border border-dark w-100">
                        <input {...getInputProps()}

                            onChange={e => handleFileChosen(e.target.files[0])} />
                        {files.length === 0 ?
                            <p className="text-center">
                                <BsCardImage />
                                <br />
                                Drop your calculation text file here</p>
                            :
                            <ul>{files}</ul>
                        }
                    </div>

                    <button type="submit" className="my-2 btn rounded-pill">Calculate</button>
                </form>

            </div>
        </div>
    );
};

export default ScreenA;