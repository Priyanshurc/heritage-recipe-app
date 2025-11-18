const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outPath = path.resolve(__dirname, '..', 'IA_Report.pdf');

const doc = new PDFDocument({margin: 50, size: 'A4'});
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

function heading(text) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(14).text(text, {align: 'left'});
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(11);
}

function paragraph(text) {
  doc.font('Helvetica').fontSize(11).text(text, {align: 'left'});
  doc.moveDown(0.5);
}

// Document metadata
doc.info.Title = 'IB Computer Science IA - Recipes Lite';
doc.info.Author = 'Paramveer Gupta';

// Title
doc.font('Helvetica-Bold').fontSize(18).text('IB COMPUTER SCIENCE', {align: 'center'});
doc.moveDown(0.1);
doc.fontSize(16).text('INTERNAL ASSESSMENT 2026', {align: 'center'});
doc.moveDown(1.0);

// Header block
doc.font('Helvetica-Bold').fontSize(12).text('Criteria A', {align: 'left'});
doc.moveDown(0.2);

doc.font('Helvetica').fontSize(11).text('Name: Paramveer Gupta');
doc.font('Helvetica').fontSize(11).text('Client: Roshani Gupta');
doc.font('Helvetica').fontSize(11).text('Title of Project: Recipes Lite: A Basic Recipe Finder App');
doc.font('Helvetica').fontSize(11).text('WORD COUNT: 504');

doc.moveDown(0.8);

// Identifying the Problem
heading('Identifying the Problem');
paragraph(`A 31-year-old homemaker, Mrs. Roshni Gupta, runs a cloud kitchen from home. She is esoteric in cooking, especially for traditional Indian and Asian recipes. Although she enjoys cooking, she often struggles to find many specific and unique traditional recipes online. Most websites are either filled with advertisements or present trendy versions of dishes, making it difficult to find authentic and trusted recipe sources. Sometimes instructions are incomplete or difficult to follow while cooking. This creates delays in preparation and adds unnecessary stress when preparing customer orders.`);
paragraph(`While she prepares meals, she usually looks up recipes using Google and YouTube, but it often turns into a frustrating task in which she ends up clicking through several pages and videos just to figure out the exact steps, which are not always clear or easy to follow. Therefore, she writes recipes down by hand to make them easier to follow, but paper can get wet, torn, or lost in the mess of the kitchen. She expressed that life would be easier if everything she needed were kept in one location — a quick, organized, and user-friendly personal recipe space.`);

// Consultation and Observations
heading('Consultation and Observations');
paragraph(`I know my client personally and discussed the issue with her in person. After observing her cooking routine, I noticed how time-consuming it is for her to switch between apps and browser tabs while working in the kitchen. She wants a mobile app that allows easy access to a set of trusted recipes and step-by-step instructions. She also wants to save her favorite recipes and store her exclusive recipes in the same app.`);

// Presented IT Solution
heading('Presented IT Solution');
paragraph(`I intend to create Heritage Recipes Lite, an intuitive mobile application to help the client overcome these difficulties. The goal is to create a simple and reliable space where she can access traditional Asian recipes without relying on many web sources.`);
paragraph('Core features of the app include:');
paragraph('• A scrollable list of traditional recipes\n• A built-in search function\n• Detailed recipe pages showing all required ingredients and clear, step-by-step instructions\n• An option for users to submit their recipes\n• A “favorites” section to save and revisit preferred recipes easily');
paragraph(`The app will be developed using Flutter, a cross-platform mobile framework known for its clean UI and smooth performance on Android devices. For the backend, the project will use a Node.js + Express REST API with MongoDB for data storage. (Note: earlier planning mentioned Firebase; the implemented solution uses MongoDB and a custom backend.)`);

// Solution suitability
heading("The solution's suitability");
paragraph(`The client's everyday issue is directly addressed by this app. She will be able to locate and save recipes in a convenient, well-organized, and customized manner. Key programming principles including UI design, input validation, data handling, cloud integration, and search capabilities are included in the app. Because of these features, the project is appropriate for the HL Computer Science Internal Assessment while remaining feasible to construct and evaluate.`);

// Criteria B
doc.addPage();
doc.font('Helvetica-Bold').fontSize(14).text('Criteria B', {align: 'left'});
doc.moveDown(0.5);

heading('Overview of the Solution');
paragraph(`The application, Heritage Recipes Lite, helps the client, Roshani Gupta, access, search, save, and upload traditional Asian recipes. Since she works mainly from her phone, the app is developed in Flutter for Android deployment. Instead of Firebase, the project uses MongoDB for database management, accessed through a custom Node.js + Express backend with REST APIs.`);
paragraph(`The app includes a login and registration system; only authenticated users can submit new recipes or manage favorites. Recipe data is stored in MongoDB with documents containing title, ingredients, steps, imageURL, and owner user ID. Authentication uses token-based (JWT) methods and all CRUD operations are performed via secure API calls.`);

heading('System Navigation (User Flow)');
paragraph(`When the user launches the app, they see a login page. New users can register. Once authenticated, users are directed to the Home screen, where they can:\n• View a list of recipes\n• Search for recipes by name or main ingredient\n• Tap a recipe to view complete details\n• Bookmark recipes for future reference\n• Add a new recipe through a simple form (title, ingredients, steps, and image)\nNavigation is kept clean and linear to reduce friction for a user cooking in real-time.`);

heading('Summary');
paragraph(`This solution uses a modern full-stack approach combining Flutter and MongoDB via a backend API. The app is structured with clear modules and clean UI navigation. MongoDB provides a flexible schema for recipe data, and all user interactions are managed via secure API calls. The project is suitable in scope and complexity for the Internal Assessment since it incorporates important technical elements such as data handling, modular programming, RESTful API design, and authentication.`);

// Footer / metadata

doc.moveDown(1);
doc.font('Helvetica').fontSize(10).text('Generated by project tooling. Author: Paramveer Gupta', {align: 'left'});

doc.end();

stream.on('finish', () => {
  console.log('PDF generated at:', outPath);
});

stream.on('error', (err) => {
  console.error('Error writing PDF:', err);
});
