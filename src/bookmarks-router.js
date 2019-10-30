const uuid = require('uuid/v4');
const {isWebUri} = require('valid-url')
const express = require('express');
const bookmarksRouter = express.Router()
const bookmarks = require('./store')
const logger = require('./logger');
const bodyParser = express.json()

bookmarksRouter
	.route('/bookmark')
	 .get((req, res) => {
			res.json(bookmarks)
	 })
		.post(bodyParser, (req, res) => {

	 const {url, title, description, rating} = req.body

	 if(!title || !url ||!description ||!rating) {
			logger.error('Title, url, description, and rating ar required');
			return res
				.status(400)
				.send('Invalid data')
	 }

	 if(typeof rating !== 'number' || parseInt(rating) > 5 || parseInt(rating) < 0) {
			logger.error(`invalid rating of ${rating}`)
			return res
				.status(400)
				.send('rating must be between 1 and 5')
	 }

	 if(!isWebUri(url)) {
			logger.error('Is not a valid url')
			return res
				.status(400)
				.send('Must contain a valid url')
	 }

	 const id = uuid();
	 const bookmark = {
			id, 
			title, 
			description, 
			url, 
			rating
	 };

			 bookmarks.push(bookmark);

			logger.info(`Bookmark with id ${bookmark.id} is created`)
			 res
					.status(201)
			 		.location(`http://localhost:8000/bookmark/${bookmark}`)
			 		.json(bookmark)
})


bookmarksRouter
	 .route('/bookmark/:id')
	 .get((req, res) => {
			const {id} = req.params;
	 		const bookmark = bookmarks.find(bm => bm.id === id);

	 		//Check to find the bookmark
	 		if(!bookmark) {
				logger.error(`Bookmark with id ${id} not found`);
				return
					res.status(404)
					.send('Bookmark not found')
				}

	 	res.json(bookmark);
	})
	 .delete((req, res) => {
				const {id} = req.params;
				const bmIndex = bookmarks.findIndex(bm => bm.id === id) 
	
	 			if (bmIndex === -1) {
					logger.error(`Bookmark with ${id} not found.`);
	 				return res
				 		.status(404)
				 		.send('not found')
		 }

			 bookmarks.splice(bmIndex, 1);

	 		logger.info(`Bookmark with id ${id} deleted successfully`)
			 res
	 			.status(204)
	 			.end()
		});
			

module.exports = bookmarksRouter



















