const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
const { MediaServices } = require("@azure/arm-mediaservices");
const config = require("../config/config");


const mediaServicesClient = new MediaServices(
  process.env.AZURE_SUBSCRIPTION_ID,
  process.env.AZURE_RESOURCE_GROUP,
  new DefaultAzureCredential()
);


// Process a video with Azure Media Services
async function processVideo(assetName, inputBlobUrl) {
  // Create an Asset
  const asset = await mediaServicesClient.assets.createOrUpdate(
    process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME,
    assetName,
    {}
  );

  // Create an Input Asset
  const inputAsset = await mediaServicesClient.assets.createOrUpdate(
    process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME,
    `${assetName}-Input`,
    { container: inputBlobUrl }
  );

  // Create a Job to encode the video
  const job = await mediaServicesClient.jobs.create(
    process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME,
    "myTransform",
    "myJob",
    {
      input: { assetName: inputAsset.name },
      outputs: [{ assetName: asset.name }]
    }
  );

  // Wait for the Job to complete
  // ...

  // Create a Streaming Locator
  const locator = await mediaServicesClient.streamingLocators.create(
    process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME,
    "myLocator",
    {
      assetName: asset.name,
      streamingPolicyName: "Predefined_MultiDrmStreamingPolicy"
    }
  );

  // Get the streaming URL
  const paths = await mediaServicesClient.streamingLocators.listPaths(
    process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME,
    locator.name
  );
  const streamingUrl = `https://${process.env.AZURE_STREAMING_ENDPOINT_HOSTNAME}/${paths.streamingPaths[0].paths[0]}`;

  return streamingUrl;
}

// // Usage
// const containerName = "my-container";
// const blobName = "my-video.mp4";
// const filePath = "path-to-my-video.mp4";
// const assetName = "my-asset";

// uploadVideo(containerName, blobName, filePath).then((uploadBlobResponse) => {
//   const inputBlobUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blobName}`;
//   processVideo(assetName, inputBlobUrl).then((streamingUrl) => {
//     console.log(`Streaming URL: ${streamingUrl}`);
//   });
// });