/*
 * File Name : Server.js
 * Task : Run Server and fetch multiple emails from DB to send reminder
 * Invoke all the email task at once and update DB once the email is sent 
 */

/*
 * Load all the required modules 
 */
var async = require("async");
var http = require("http");
var nodemailer = require("nodemailer");
var express = require("express");
var path = require("path");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');


var app = express();

// This will store emails needed to send.
var listofemails = [];
// Will store email sent successfully.
var success_email = [];
// Will store email whose sending is failed. 
var failure_email = [];

var transporter;

var subject= "";
var message = "";
var response;
var contents = "";

//View engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body parser
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.render('signin');
});

app.post('/signin', (req, res) =>{
	if(req.body.user === "SittingPretty" && req.body.pass === "Jeanna0604"){
		res.render('email');
	}else{
		res.render('signin', {
			msg: "Username or Password Incorrect"
		});
	}
});

app.post("/preview", upload.single('csvFile'),(req, res)=>{
	if (!req.file){
		res.render('email',{
			msg:"Please Upload a File"
		});
	 }else{
		contents = fs.readFileSync(req.file.path, 'utf8');
		res.render('preview', {
			message:req.body.message,
			subject: req.body.subject
		});
	 }
});

app.post("/send", (req, res) => {

		response = res;
		message = 
		//======================================================================
		`
		<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
		<tr>
			<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
			<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				<div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

					<!-- START CENTERED WHITE CONTAINER -->

					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

						<!-- START MAIN CONTENT AREA -->
						<tr>
							<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
								<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
									<tr>
										<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
											<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Dear Valued Customer,</p>
											<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${req.body.message}</p>
											<br>
											<br>
											<div>
												<p>You can reply directly to this email, call us at 508-830-1400, or click the button below to book an appointment!</p>
											</div>
											<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
												<tbody>
													<tr>
														<td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
															<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
																<tbody>
																	<tr>
																		<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="http://www.sittingprettyspa.net/request-appointment.html" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Book Your Appointment Today!</a> </td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>

										</td>
									</tr>
								</table>
							</td>
						</tr>

					<!-- END MAIN CONTENT AREA -->
					</table>

					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
						<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
								<td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
									<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Sitting Pretty Spa, 20 Home Depot Dr, Plymouth, MA 02360</span>
								</td>
							</tr>
							<tr>
								<td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
									Call Today! 508-830-1400
								</td>
							</tr>
						</table>
					</div>
					<!-- END FOOTER -->

				<!-- END CENTERED WHITE CONTAINER -->
				</div>
			</td>
			<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
		</tr>
	</table>
		
		`
		//======================================================================
		;
		subject = `
		${req.body.subject}
		`;
		listofemails = contents.split("\r\n");
		new massMailer();

	  //return res.send('Please upload a file')	
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


/* Loading modules done. */

function massMailer() {
	var self = this;
	transporter = nodemailer.createTransport({
        service: 'mailjet',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "dd8c3d2b9462d412c943ea67d0b3c22e", // generated ethereal user
            pass: "c34eca03e743204fc8eff56fa7d4623d"  // generated ethereal password
        },
    	    tls: {rejectUnauthorized: false},
			debug:true
	});

	// Fetch all the emails from database and push it in listofemails
	self.invokeOperation();
};

/* Invoking email sending operation at once */

massMailer.prototype.invokeOperation = function() {
	var self = this;
	async.each(listofemails,self.SendEmail,function(){
		console.log(success_email);
		console.log(failure_email);
		response.render("email",{
			msg:"Messages Sent!"
		})
	});
	console.log("END");
}

/* 
* This function will be called by multiple instance.
* Each instance will contain one email ID
* After successfull email operation, it will be pushed in failed or success array.
*/

massMailer.prototype.SendEmail = function(Email,callback) {
	console.log("Sending email to " + Email);
	var self = this;
	self.status = false;
	// waterfall will go one after another
	// So first email will be sent
	// Callback will jump us to next function
	// in that we will update DB
	// Once done that instance is done.
	// Once every instance is done final callback will be called.
	async.waterfall([
		function(callback) {				
			var mailOptions = {
				from: 'sittingprettyspa.net@outlook.com',		
				to: Email,
				subject: subject, 
				html: message
			};
			transporter.sendMail(mailOptions, function(error, info) {				
				if(error) {
					console.log(error)
					failure_email.push(Email);
				} else {
					self.status = true;
					success_email.push(Email);
				}
				callback(null,self.status,Email);
			});
		},
		function(statusCode,Email,callback) {
				console.log("Will update DB here for " + Email + "With " + statusCode);
				callback();
		}
		],function(){
			//When everything is done return back to caller.
			callback();
	});
}

 //lets begin