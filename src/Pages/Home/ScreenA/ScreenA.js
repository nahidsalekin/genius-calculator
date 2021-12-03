import '../Screen.css'
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsCardImage } from "react-icons/bs";
import swal from 'sweetalert';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ScreenA = ({ results, setResults, setContent, handleShow, socket, processing, setProcessing, setUpdating }) => {

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [calcTitle, setCalcTitle] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (acceptedFiles[0])
            handleFileChosen(acceptedFiles[0])
    }, [acceptedFiles])

    const handleSubmission = e => {
        e.preventDefault();

        if (fileContent === '') {
            swal({
                title: "File Not Found!",
                text: "Upload/Drop a valid .txt file.",
            });
        }
        else {
            if (/[^0-9-+*/.]/.test(fileContent) || fileContent === '' ||
                ! /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/.test(fileContent)) {
                swal({
                    title: "Invalid File!",
                    text: "Choose a valid .txt file. Allowed Characters: [0-9, +, -, *, /]",
                    icon: "error",
                });
            }
            else {
                setProcessing(true);
                socket.emit("calculate", { title: calcTitle, input: fileContent });
            }
        }
    }

    let fileReader;

    const handleFileRead = (e) => {
        setFileContent(fileReader.result);
    };

    const handleFileChosen = (file) => {
        setFileName(file.name);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        setUpdating(true);
        const items = Array.from(results);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setResults(items);

        //update db collection for every reordering
        socket.emit("updateResults", { results: items });
    }
    const showInput = inputContent => {
        setContent(inputContent);
        handleShow();
    }

    return (
        <div className="screen-container">
            <div className="results-container screen-a p-2">
                <h5 className="fw-bold">Total Results: {results.length}</h5>

                <div className="results mt-3">
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                            {(provided => (
                                <div className="characters" {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                    {provided.placeholder}
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
                                                        <span>= {result.result}</span>
                                                        <h6 className="mb-0 ms-3">{result.title}</h6>
                                                    </div>
                                                    <button className="btn rounded-pill px-4"
                                                        onClick={() => showInput(result.input)}>See Input</button>
                                                </div>
                                            )}
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
                            accept=".txt"
                            onChange={e => handleFileChosen(e.target.files[0])}
                        />
                        {fileName === '' ?
                            <p className="text-center">
                                <BsCardImage />
                                <br />
                                Upload your calculation text file here</p>
                            :
                            <ul>{fileName}</ul>
                        }
                    </div>
                    {processing ?
                        <div className="my-2"> Please Wait. <strong>Calculating...</strong></div>
                        :
                        <button type="submit" className="my-2 btn rounded-pill">Calculate</button>
                    }
                </form>

            </div>
        </div>
    );
};

export default ScreenA;