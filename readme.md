# Research Research Bot

The Research Bot App is a powerful tool designed to simplify research by leveraging AI and web scraping technologies. With a user-friendly interface and integrated APIs, this app delivers precise and comprehensive results to your queries.

---

## 🌟 Features

- AI-powered research using OpenAI API and Bing Web Search.
- Web scraping for enhanced data gathering.
- Modern, responsive UI for seamless user experience.
- Customizable backend configurations.

---

## 📺 Tutorial Video

Watch the step-by-step walk by to understand the functionality and setup of the Research bot App:  
[Watch on YouTube](https://youtu.be/FMaWWxre84E)

---

## 🛠 Backend Configuration

### Prerequisites

Before starting, ensure you have the following:  
1. **Node.js** installed on your system.  
2. **NPM** for managing dependencies.  
3. API keys for:  
   - OpenAI API  
   - Bing Web Search API  

### Configuration

1. Add your API keys to the `secrets.jsonnet` file.  

   ```jsonnet
   local OPENAI_API_KEY = "sk-proj-***";
   local BING_API_KEY = "9be1*****";
    ```

2. Place the secrets.jsonnet file in the appropriate directory as specified in the app.

### 🚀 Installation

Follow these steps to install and set up the application:

*Clone the repository:*


```
git clone https://github.com/Kshitijkulal/edgechains-example.git
cd edgechains-example

```

Install the dependencies:

```
npm install

```

### 📖 Usage

*Start the development server:*


```
npm run dev
```
*Access the application in your browser:*


```http://localhost:3000```

Enter your research query in the app interface, and let the AI provide the results.

### 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, submit issues, or create pull requests to help improve the Research Bot App.

### 📜 License
This project is licensed under the MIT License.