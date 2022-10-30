import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import { Web3Storage } from "web3.storage";

const greeterAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

const ipfsToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERGQmNGNzAxZGRhMjFDMjQzNjFFNDM3MWZCNzE0RkEwZTc5NDY3RTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjcxNDIyODMyNjgsIm5hbWUiOiJJUEZTIEFQSSAxIn0.AJNm9jlMpKqZHNra1xKqN2faIyS_gvSoHReYj6x9Ews";

function App() {
  const [greeting, setGreetingValue] = useState("");
  const [image, setImage] = useState(null);
  const [greetingImage, setGreetingImage] = useState("");

  const fileInput = useRef(null);

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setGreetingValue(data[0]);

        console.log("data: ", data);

        if (data[1] !== "") {
          const storage = new Web3Storage({ token: ipfsToken });
          const res = await storage.get(data[1]);

          const files = await res.files();

          setGreetingImage(`https://ipfs.io/ipfs/${data[1]}/${files[0].name}`);
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  const setGreeting = async (value) => {
    if (!value && image === null) return;
    if (typeof window.ethereum !== "undefined") {
      try {
        await requestAccount();
        const storage = new Web3Storage({ token: ipfsToken });

        //add function to upload file

        const cid = await storage.put([image]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          greeterAddress,
          Greeter.abi,
          signer
        );
        const transaction = await contract.setGreeting(value, cid);
        await transaction.wait();

        fetchGreeting();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await setGreeting(event.target.greetingInput.value);
    setGreetingValue(event.target.greetingInput.value);
    event.target.greetingInput.value = "";
  };

  const handleClick = (e) => {
    e.preventDefault();
    fileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setImage(fileUploaded);
  };

  return (
    <div className="w-full max-w-max container">
      <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
        <div className="text-gray-600 font-bold text-lg mb-2">
          React Ethereum Dapp
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
          <div className="text-gray-600 font-bold text-md mb-2">
            Fetch Greeting Message From Smart Contract
          </div>

          <div className="flex">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={fetchGreeting}
            >
              Fetch Greeting
            </button>
          </div>
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
          <div className="text-gray-600 font-bold text-md mb-2">
            Set Greeting Message On Smart Contract
          </div>
          <form
            className="flex items-center justify-between"
            onSubmit={(event) => handleSubmit(event)}
          >
            <div>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4  rounded"
                onClick={handleClick}
              >
                Upload Image
              </button>
              <input
                onChange={handleChange}
                ref={fileInput}
                className="hidden"
                id="file_input"
                type="file"
              />
            </div>
            <input
              className="shadow mx-2 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="greetingInput"
            />

            <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Set Greeting
            </button>
          </form>
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400 bg-gray-100">
          <div className="text-gray-600 font-bold text-md mb-2">
            Greeting Message
          </div>

          <p>{greeting}</p>
          {greetingImage !== "" ? (
            <div className="mt-2 mb-2">
              <img
                src={greetingImage}
                alt="Greeting"
                width="200"
                height="200"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
