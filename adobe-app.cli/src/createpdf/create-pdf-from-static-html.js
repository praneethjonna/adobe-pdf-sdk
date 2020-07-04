const path = require('path');
const assetCredentials = require("assets/dc-services-sdk-credentials.json");
const assetCredentialsPath = path.dirname(require.resolve("assets/dc-services-sdk-credentials.json"));
/*
 * Copyright 2019 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const DCServicesSdk = require('@adobe/dc-services-node-sdk');
/**
 * This sample illustrates how to convert an HTML file to PDF. The HTML file and its associated dependencies must be
 * in a single ZIP file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

/**
 * Sets any custom options for the operation.
 *
 * @param htmlToPDFOperation operation instance for which the options are provided.
 */
const setCustomOptions = (htmlToPDFOperation) => {
	// Define the page layout, in this case an 8 x 11.5 inch page (effectively portrait orientation).
	const pageLayout = new DCServicesSdk.CreatePDF.options.PageLayout();
	pageLayout.setPageSize(8, 11.5);

	// Set the desired HTML-to-PDF conversion options.
	const htmlToPdfOptions = new DCServicesSdk.CreatePDF.options.html.CreatePDFFromHtmlOptions.Builder()
		.includesHeaderFooter(true)
		.withPageLayout(pageLayout)
		.build();


	htmlToPDFOperation.setOptions(htmlToPdfOptions);
};

module.exports = {

	execute: function (inputPath, outputPath) {
		try {
			//console.log(assetCredentials);
			// Initial setup, create credentials instance.
			const credentials = DCServicesSdk.Credentials
				.serviceAccountCredentialsBuilder()
				.fromFile(assetCredentialsPath + "/dc-services-sdk-credentials.json")
				.build();

			const clientConfig = DCServicesSdk.ClientConfig
				.clientConfigBuilder()
				.withConnectTimeout(100000)
				.withReadTimeout(40000)
				.build();

			// Create an ExecutionContext using credentials and create a new operation instance.
			const executionContext = DCServicesSdk.ExecutionContext.create(credentials, clientConfig),
				htmlToPDFOperation = DCServicesSdk.CreatePDF.Operation.createNew();

			// Set operation input from a source file.
			const input = DCServicesSdk.FileRef.createFromLocalFile(inputPath);
			htmlToPDFOperation.setInput(input);

			// Provide any custom configuration options for the operation.
			setCustomOptions(htmlToPDFOperation);

			// Execute the operation and Save the result to the specified location.
			htmlToPDFOperation.execute(executionContext)
				.then(result => result.saveAsFile(outputPath))
				.catch(err => {
					if (err instanceof DCServicesSdk.Error.ServiceApiError
						|| err instanceof DCServicesSdk.Error.ServiceUsageError) {
						console.log('Exception encountered while executing operation', err);
					} else {
						console.log('Exception encountered while executing operation', err);
					}
				});
		} catch (err) {
			console.log('Exception encountered while executing operation', err);
		}
	}
}

