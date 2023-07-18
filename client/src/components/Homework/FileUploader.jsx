import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import axios from 'axios';
import { saveAs } from 'file-saver';

import RenderPDF from './RenderPDF';


const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [hasLatex, setHasLatex] = useState(true);
  const [isHomework, setIsHomework] = useState(true);
  const [name, setName] = useState(null);
  const [processingSolution, setProcessingSolution] = useState(false);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile.size > 5242880) {
      alert('The file you selected is too large. Max size 5MB.');
    } else{
      setFile(selectedFile);
    }
  }

  const handleHomeworkRadioButton = (e) => {
    setIsHomework(!isHomework);
  }

  const handleLatexRadioButton = (e) => {
    setHasLatex(!hasLatex);
  }

  const onSubmit = async (token, verifiedBuyer) => {
    if (file) {
      const formData = new FormData();
      try {
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('hasLatex', hasLatex);
        formData.append('isHomework', isHomework);
        formData.append('name', name);
        formData.append('sourceId', token.token);
        setProcessingSolution(true);
        const headers = {
          responseType: 'blob',
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        const res = await axios.post('/homework', formData, headers);
        const blob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(blob, 'solutions.pdf');
      } catch (err) {
        const errorMessage = err.response.data.message;
        alert(errorMessage);
      }
    } else {
      alert('No file selected.');
    }
    setProcessingSolution(false);
  }

  const headerText = () => {
    if (processingSolution) {
      return "Processing homework...."
    } else {
      return "Upload your homework."
    }
  }

  return (
    <Container>
      <Row>
        <Col xs={6}>
          <div>
            <h5>{headerText()}</h5>
            <div>
              <Form.Group>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  id="fileUploader"
                  onChange={(e) => onFileChange(e)}
                />
                <p>Select a file smaller than 5MB before uploading</p>
                <p className="mt-3">
                  <b>Full Name</b>
                </p>
                <Form.Control
                  type="text"
                  id="name"
                  value={name}
                  placeholder="Your Full Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <p className="mt-3">
                  <b>Does your assignment have equations? (Example: Latex, physics,
                    chemistry, etc)</b>
                </p>
                <Form.Check
                  value={true}
                  type="radio"
                  aria-label="radio 1"
                  label="Yes"
                  onChange={handleLatexRadioButton}
                  checked={hasLatex === true}
                />
                <Form.Check
                  value={false}
                  type="radio"
                  aria-label="radio 2"
                  label="No"
                  onChange={handleLatexRadioButton}
                  checked={hasLatex === false}
                />
                <p className="mt-3">
                  <b>Is this a homework assignment or a study guide?</b>
                </p>
                <Form.Check
                  value={true}
                  type="radio"
                  aria-label="radio 1"
                  label="Homework Assignment"
                  onChange={handleHomeworkRadioButton}
                  checked={isHomework === true}
                />
                <Form.Check
                  value={false}
                  type="radio"
                  aria-label="radio 2"
                  label="Study Guide"
                  onChange={handleHomeworkRadioButton}
                  checked={isHomework === false}
                />
              </Form.Group>
              <h6 className="mt-3">Get solutions for $1</h6>
              <PaymentForm
                applicationId="sandbox-sq0idb-VjaXQsDt014XTRq4IY14aw"
                cardTokenizeResponseReceived={
                  (token, verifiedBuyer) => onSubmit(token, verifiedBuyer)
                }
                locationId='XXXXXXXXXX'
              >
                <CreditCard/>
              </PaymentForm>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <RenderPDF file={file}/>
        </Col>
      </Row>
    </Container>
  );
}

export default FileUploader;
