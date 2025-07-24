import React, { useEffect, useState } from "react";

const Component = () => {
  // Load messages from localStorage or initialize with an empty array
  const [inputText, setInputText] = useState(() => {
    return JSON.parse(localStorage.getItem("chatMessage")) || [];
  });

  const [input, setInput] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() === "") return; // Fix: proper empty check

    const newMessages = [...inputText, input];
    setInputText(newMessages); // Update state
    setInput(""); // Clear input
  };

  // Save messages to localStorage when inputText changes
  useEffect(() => {
    localStorage.setItem("chatMessage", JSON.stringify(inputText));
  }, [inputText]);

  return (
    <div className="bg-blue-400 h-screen flex flex-col justify-end">
      <div className="overflow-y-auto p-4 space-y-2">
        {inputText.map((msg, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-2 w-60 ml-auto mr-2"
          >
            {msg}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex p-2 gap-2 bg-blue-400">
        <input
          type="text"
          value={input}
          className="flex-grow rounded-2xl bg-white p-2 border"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the message"
        />
        <button type="submit" className="p-2">
          <img
            src="src/send_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"
            alt="send"
          />
        </button>
      </form>
    </div>
  );
};

export default Component;

    // import React, { useEffect, useState } from "react";

    // const Component = ()=>{
    //     let [inputtext,setinputtext] = useState(()=>{return JSON.parse(localStorage.getItem("chatMessage")) || []});
    //     let [input,setinput] = useState('');
    //     const handlesubmit = (e)=>{
    //         e.preventDefault();
    //         if(input==""||" ") return ;
    //         let newmsg = [...inputtext,input]
    //         setinputtext(newmsg)
    //         setinput('')
    //         console.log("submitted",inputtext);
    //     };  
    //     useEffect(()=>{
    //         localStorage.setItem("chatMessage",JSON.stringify(inputtext))
    //     },[inputtext])
    //     return(
    //         <div className="bg-blue-400 h-screen flex justify-end flex-col">
    //             {
    //                 inputtext.map((msg,index)=>(
    //                     <div key={index} className=" bg-white rounded-2xl p-2 rounded-br-sm w-60 flex flexrow  ml-auto mr-2 mb-2 "> {msg} </div>
    //                 ))
    //             }
    //             <form onSubmit={handlesubmit}> 
    //             <input type="text" 
    //                 value={input} 
    //                 className="bg-white flex relative flexbox mx-auto justify-center rounded-4xl p-2 border-white" 
    //                 onChange={(e)=>{setinput(e.target.value)}} 
    //                 placeholder="Enter the message" />
    //             <button type="submit" className="bg-white text-blue-400"><img src="src/send_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"  /> </button>
    //             </form>
    //         </div>
    //     )
    // }   
    // export default Component


// import React, { useState, useEffect } from "react";

// function ChatApp() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState(() => {
//     // Load messages from localStorage on first render
//     return JSON.parse(localStorage.getItem("chatMessages")) || [];
//   });

//   // Save messages to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("chatMessages", JSON.stringify(messages));
//   }, [messages]);

//   const handleSend = () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, input];
//     setMessages(newMessages);
//     setInput(""); // clear input
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto space-y-3">
//       {/* Display messages */}
//       <div className="space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className="bg-blue-100 text-blue-800 p-2 rounded-lg w-fit max-w-xs"
//           >
//             {msg}
//           </div>
//         ))}
//       </div>

//       {/* Input and send button */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           className="flex-grow border p-2 rounded"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-500 text-white px-4 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatApp;
