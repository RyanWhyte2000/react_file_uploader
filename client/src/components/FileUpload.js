import React, { Fragment, useState } from 'react'
import axios from 'axios';
import Progress from './Progress';
export const FileUpload = () => {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState('Choose Fille');
    const [uploadFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState();

    const onChange = e => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);

    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);


        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: ProgressEvent => {
                    setUploadPercentagge(parseInt(Math.round((ProgressEvent.loaded * 100)/ 
                    ProgressEvent.total)))
                    setTimeout(() => setUploadPercentage(0), 10000);

                }
            });
            const { fileName, filePath} = res.data;
            setUploadedFile({fileName, filePath});

            setMessage('File Uploaded');
        } catch (err) {
            if(err.response.status === 500){
                console.log('There was a problem with the server');              
            }else{
                console.log(err.response.data.msg);
            }
        }
    };
    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                <div className='custom-file' >
                    <input type='file' className='custom-file-input' id='customFile'
                     />
                    <label className='custom-file-label' for='customFile'>
                        {fileName}
                    </label>
                </div>
                <Progress percentage={uploadPercentage}/>
                <input
                    type='submit'
                    value='Upload'
                    className='btn btn-primary btn-block mt-4' />
            </form>
            {uploadFile ? <div className='row mt-5'>
                <div className='col-md-6 m-auto'>
                    <h3 className='text-center'> {uploadFile.fileName}</h3>
                    <img style={{width: '100%'}} src={uploadFile.filePath} alt=""/>
                </div>

            </div>: null}
        </Fragment>
    )
}
