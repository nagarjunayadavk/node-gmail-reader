# node-gamil-reader
By using this application we will able to read gmail  mails.

# How To Run?
   after dowloading zip or git clone command please run below commands
   Prerequisites -- Node required.
    1) npm install
    2) node ./app.js

# How To Test?
    you can use postman to test application.

    GET: http://localhost:900/readMails
    Headers:
     mail, secret //======= this is your gmail id and pasword
      //==== Generally i will throw an error from gmail for permission we have eble less secure apps in gmail also.
      
    O/P: 
    {
	    "sucess": "sucessfully Triggred",
	    "order_details" : {

	    }
	}
