import React, {useEffect, useState } from "react";

const CreateJobApplication = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {

    }, []);

    const PostJobApplication = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "id": 0, "name": "Json", "surname": "j",
                "phoneNumber": 0, "email": "temp@mail.net",
                "EmployeeAddressId": 0,
                "employeeAddress":
                    { "id": 0, "city": "New York", "postCode": "11-111", "street": "str 11" }
            })
        };
        fetch('http://localhost:5000/api/JobApplications', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };

    const handleSubmission = () => {
        const formData = new FormData();

        formData.append('Id', 0);
        formData.append('Name', "Json");
        formData.append('Surname', "xy");     
        formData.append('Email', "e3@gr");
        formData.append('Content', "bzdury");
        formData.append('PositionId', 1);
        formData.append('ApplicationDate', "2021-02-01");
        formData.append('CVPath', "");
        formData.append('CVFile', selectedFile);

        fetch(
            'http://localhost:5000/api/JobApplications',
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <input type="file" name="file" onChange={changeHandler} />
            {isSelected ? (
                <div>
                    <p>Filename: {selectedFile.name}</p>
                    <p>Filetype: {selectedFile.type}</p>
                    <p>Size in bytes: {selectedFile.size}</p>
                  
                </div>
            ) : (
                    <p>Select a file to show details</p>
                )}
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    );
}
export default CreateJobApplication;