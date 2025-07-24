import React, { useState } from "react";
import axios from "axios";
function Profilepic(){
    const [image,setimage] = useState('');
    const handlechange = async(e)=>{
        try{
        e.preventDefault();
        setimage(e.target.files[0])
        const res = await axios.post("https://lynk-backend-bmv8.onrender.com/user/upload",{
            body:image,
        })
        const data = res.json();
        console.log("image successfully uploaded::",data.imageUrl);
    }catch(err){
        console.log(err);
    }
    }

    return(
        <div>
            <form>
            <input type="file" accept="image/*" onChange={handlechange}/>
            </form>
        </div>
    )
}
