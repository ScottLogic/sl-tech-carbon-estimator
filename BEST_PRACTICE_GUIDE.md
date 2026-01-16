# Best Practice Guide for Estimation Inputs

Use this guide to assist you when entering your Estimate Inputs

## Data Collection

- Review the different input sections and gather all relevant data before starting.
- Use official sources and documentation where possible.
- Double-check values for accuracy.

## Organisation

#### Whole organisation or department:

- Enter the total number of employees
- Select the percentage of device usage as accurately as possible
- Select the location where the MAJORITY of employees are located

#### Specific service/project within the organisation:

- Enter the number of users actively engaged in this service/project who are using any devices
- Select the percentage of device usage as accurately as possible
- Select the location where the MAJORITY of these users are located


## On-Premise Servers

On-Premise servers include any physical servers either located directly in-house or managed by your organisation in a remote location. 


## Cloud Services

Data regarding the number of on-premise and cloud provider servers should be available from your IT/Technology team.

All major cloud providers provide tooling that allows billing data to be obtained. Your IT/Technology team should also be able to tell you where the majority of your cloud provider servers are located.


## Customers

Determining the primary purpose of your digital service can often be challenging. The TSCE provides 4 specific categories for you to choose from, each one with increasing emission impacts:

- Information
- E-Commerce
- Social Media
- Streaming 

Information is a very broad category but can cover everything up to and including capturing data from users (forms, user account creation) and simple checkout/payment services or basic digital transactions (paying invoices, bills etc).

E-Commerce sites tend to be more involved, with users spending much more time navigating/browsing the site and more involved checkout/payment processes. The services will often also have more media content so data transfer is higher.

Social Media services will usually involve much more content, images and short videos, along with fairly extended user engagement times.

Streaming services (audio and video) are generally thought of as providing longer form digital content of a high quality (lossless audio, 4k video).

## AI Inference

Artificial Intelligence (AI) model inference has become an increasingly significant contributor to organizational carbon emissions. Use this section when estimating AI-related emissions:

#### Task Type

Select the primary task type that best represents your AI workload:

- **Text Generation** - Large language models, chatbots, content creation
- **Image Generation** - Text-to-image models, image manipulation tasks
- **Text Classification** - Sentiment analysis, content moderation, categorization
- **Question Answering** - Extractive QA, information retrieval
- **Token Classification** - Named entity recognition, part-of-speech tagging
- **Text Summarisation** - Document summarization, abstract generation
- **Image Classification** - Image categorization, tagging
- **Object Detection** - Locating and identifying objects in images
- **Image Captioning** - Generating descriptions for images
- **Mixed Usage (Average)** - Multiple types of AI tasks with balanced distribution

#### Monthly Inference Count

Estimate the number of inference requests your organization makes monthly. This is the number of times your AI models process inputs:

- Review your API logs or usage analytics from AI service providers
- Count inference requests across all AI workloads (chatbots, image generation, embeddings, etc.)
- If using multiple providers, sum the total monthly inferences
- For batch processing, count the number of batch jobs multiplied by items per batch
- Include both production and development/testing inferences for a full picture

#### AI Service Provider

Select the primary AI service provider you use. The provider affects energy efficiency calculations through Power Usage Effectiveness (PUE) - their data center efficiency metrics:

- **OpenAI** - GPT models, DALL-E, embeddings
- **Anthropic** - Claude models
- **Google** - Vertex AI, PaLM, Gemini
- **Microsoft** - Azure AI services, Copilot services
- **Amazon Bedrock** - SageMaker, Bedrock
- **Meta** - Open-source models (Llama)
- **Other** - Custom or unlisted providers

#### AI Service Location

Select the geographic region where the AI service provider's data centers are primarily located. This affects the carbon intensity of the energy powering the inference:

- Choose the region where your AI requests are routed
- Different providers may have data centers in multiple regions
- If using multiple regions, select the one processing the majority of your requests
- Carbon intensity varies significantly by region due to different energy grids
