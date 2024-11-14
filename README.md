To test the code run the following commands 

```
npm install
npm run test 
```
or 
```
npm install
node app.js 
```

# Sample School payment system

##### Payment API Documentation, version 1.0

## Introduction

Sample School is a school that is created for demo purpose and engaged in teaching and learning process.

This document outlines a web service designed for payment solution integrators, enabling students of Sample School to settle service fees electronically using various payment methods.

## Major integration Tasks

The major tasks required for fully implementing integrated payment management system are the following.

<table><tbody><tr><th><p>No</p></th><th><p>Major Task</p></th><th><p>Activities</p></th></tr><tr><td><p>1.</p></td><td><p>Handling payments</p></td><td><ul><li>Search payment order information</li><li>Process Payment</li></ul></td></tr></tbody></table>

## Integration Steps

The workflow for integrating payment processing for Sample School students can be summarized as below:

- Students use the unique identifier given to them to know their outstand balance
- The students open the payment processing platforms which avails the options to insert their identity number
- The payment processing platform searches the payment record and returns the details of payment including "due date", "student name" "account number" "penalty" and "total amount to be paid".
- Payment processing platform makes a Payment Transfer Transaction from Students account to School account
- Payment processing platform updates Sample School system to confirm “successful transaction”. The posted record will include “Payment status", "date", "reference code", "student name", "amount", "penalty", "total", "debit account", "credit account"

## Authentication

Each user accessing the system is identified by “Username” and “Password”. Basic Authentication requires a client to provide a username and password in the request header. This method ensures that only authorized users can access the API endpoints, adding a layer of protection.

On every request the username and password must be included in the header. To access the API, the client must include the Authorization header in each request. The value of this header should be in the format:

Authorization: Basic &lt;base64_encoded_credentials&gt;

Where &lt;base64_encoded_credentials&gt; is the Base64-encoded string of username:password. For example, if the username is _admin_ and the password is _password123_, the Base64-encoded credentials would be YWRtaW46cGFzc3dvcmQxMjM=

If the Username and Password is valid, then the system process the request else it will reply 401 error status.

Method: GET/POST

Request Header:

| Key | Value |
| --- | --- |
| Authorization | Basic &lt;base64_encoded_credentials&gt; |

Error code

| Error Code | Message |
| --- | --- |
| 401 | Unauthorized: Missing Authorization Header |

## Collecting Payment

The following steps need to be used to process the payment.

1. Retrieves outstand payment

Retrieve the outstanding payment amount by supplying the student identification number (ID Number) that was given to the student at the time of registration. Use the following API for this purpose.

[http://domainname/api/CBE/schoolbill/{id}](http://domainname/api/CBE/schoolbill/%7bid%7d)

**Method**: GET

**Input**: ID - the Identification Number generated when the student was registered.

**Return value**: An object with the following attributes

| Parameter | Description | Data type | Length |
| --- | --- | --- | --- |
| id  | Id that uniquely identifies each student | Integer |     |
| due_date | Due date for payment without penalty | String | 8   |
| student_name | Name of the student | String |     |
| amout | Outstanding balance | Decimal |     |
| penalty | Penalty payment | Decimal |     |
| total | Outstanding plus penalty amount | Decimal |     |

Error codes

| Error Code | Message |
| --- | --- |
| 400 | The provided ID is in invalid format |
| 406 | The provided ID number doesn’t exist in the record |

Sample request URL: <http://localhost:4500/api/CBE/schoolbill/1234>

Request authentication header:

Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=

1. Collect payment

Making payment record using the following API

<http://domainname/api/CBE/schoolbill>

Method: POST

The API expects an object with the following parameters:

| Parameter | Description | Datatype | Length | required |
| --- | --- | --- | --- | --- |
| id  | Student identification number | Integer |     | ✔️  |
| amount | Amount to be paid | Decimal |     | ✔️  |
| penalty | Penalty if any | Decimal |     |     |

**Return value**: An object with the following attribute

| Parameter | Description | Datatype | Length |
| --- | --- | --- | --- |
| id  | Student identification number | Integer |     |
| payment_status | Indicated the status of payment | String |     |
| date | The date and timestamp when the transaction occurred | Date Time |     |
| reference_code | A number the represent this unique transaction | Integer | 10  |
| student_name | Name of the student | String |     |
| amount | Paid amount | Decimal |     |
| penalty | Penalty amount | Decimal |     |
| total | Total price paid (amount + penalty) | Decimal |     |
| debit_account | Account number from which the money is deducted | String | 13  |
| credit_account | Account number to which the money is transferred | String | 13  |

**Error codes**

| Error Code | Message |
| --- | --- |
| 400 | The provided ID is in invalid format |
| 406 | The provided ID number doesn’t exist in the record |

Post request url: <http://localhost:4500/api/CBE/schoolbill/1234>

Sample Request Body

{

"id": 2,

"amount": 2980.84,

"penalty": 100.00

}

Request authentication header:

Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=

Sample response Body

{

&nbsp;   "payment_status": "done",

&nbsp;   "date": "2024-11-14T12:30:36.345Z",

&nbsp;   "reference_code": "2732895682",

&nbsp;   "student_name": "Ayalew Belaynesh",

&nbsp;   "amount": 2980.84,

&nbsp;   "penalty": 100,

&nbsp;   "total": 3080.84,

&nbsp;   "debit_account": "1000030382812",

&nbsp;   "credit_account": "1000453423451"

}