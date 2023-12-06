window.onload =() => {
  
  document.getElementById("hamburger").onclick = toggleNav;

  document.getElementById("add-jewelry-link").onclick = addCommentBoxes;
  document.getElementById("edit-jewelry-link").onclick = editJewelryBoxes;
  showJewels();
 // document.getElementById("add-edit-JEWEL-form").onsubmit = addJewelry;
 document.getElementById("add-JEWELS-form").onsubmit = addJewelry;
 document.getElementById("edit-JEWELS-form").onsubmit = editJewelry;
};




const toggleNav = () => {
    document.getElementById("hamburger").classList.toggle("show");

    document.getElementById("main-nav").classList.toggle("hide-small");

    console.log("toggleNav here");
}






 







//FOR POSTING/PUTTING/DELETING//////////////////////////////////////////////////////////////////


const editJewelry = async(e) => {
  e.preventDefault();
  const form = document.getElementById("edit-JEWELS-form");

  const formData = new FormData(form);//all form data is in FormData
  //formData.delete("img");
  formData.append("materials", getEditMaterials());
  
 // console.log("in here");
  let response;

     console.log("in  editJewelry"); 
     console.log(...formData);

     response = await fetch(`/api/comments/${form._id.value}`,{
      method:"PUT",
      body:formData
     });
     


     //response = await response.json();

     //get jewel w indicated id then display



 //after if, err if needed
 if(response.status !=200){
  console.log("errrrrrrrrrrrrr");
  return;
 }

 const jewel = await response.json();
 
 document.querySelector(".form-class").classList.add("transparent");
 //resetForm();
 showJewels();
 editMats(jewel);


};

const getEditMaterials = () => {
  const inputs = document.querySelectorAll("#edit-jewel-boxes input");
  let mats = [];
  inputs.forEach((input)=> {
      mats.push(input.value);
  });
  return mats;
}

const addJewelry = async(e) => {
  e.preventDefault();
  const form = document.getElementById("add-JEWELS-form");

  const formData = new FormData(form);//all form data is in FormData
  

  formData.append("materials", getMaterials());
 console.log(...formData);
  let response;

  if(form._id.value == -1)
  {
  formData.delete("_id");
     console.log("in if editJewelry"); 

     response = await fetch("/api/comments", {
      method:"POST",
      body:formData
     });
     
  }


 //after if, err if needed
 if(response.status !=200){
  console.log("errrrrrrrrrrrrr");
  return;
 }

 document.querySelector(".form-class").classList.add("transparent");
 //resetForm();
 showJewels();
};



const getMaterials = () => {
  const inputs = document.querySelectorAll("#comment-boxes input");
  let mats = [];
  inputs.forEach((input)=> {
      mats.push(input.value);
  });
  return mats;
}

const getJewelry = async () => {
  try {
      return (await fetch("api/comments/")).json();
  } catch (error) {
      console.log(error);
  }
}

const showJewels = async () =>{
  console.log("showJewels");
  let jewelry = await getJewelry();

  console.log(jewelry);
  let store = document.getElementById("store"); 
  store.innerHTML = "";
  
  jewelry.forEach((jewel)=>{
      const section = document.createElement("section");
      store.append(section);

      
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);


      const h4 = document.createElement("h4");

      h4.classList.add("separation");
      //h4.classList.add("name-decoration");
      h4.innerHTML = jewel.name;


      const h5 = document.createElement("h5");
          const p = document.createElement("p");
          store.append(h5);
          store.append(p);
          
          h5.innerHTML = jewel.description;
          p.innerHTML = "What I bought: " + jewel.materials;

      //console.log("below jewel.name");
      a.append(h4);
/*
      const img = document.createElement("img");
      img.src = jewel.img;
      section.append(img);
*/
      a.onclick = () => {
          //console.log(jewel.description);
         // toggleDescription();
          editMats(jewel);
          populateEditForm(jewel);
      }
  });
}



const editMats = (jewel)=> {
  
  const details = document.getElementById("jewel-details");
          details.innerHTML = "";
          const h5 = document.createElement("h5");
          const p = document.createElement("p");
          details.append(h5);
          details.append(p);
          h5.innerHTML = jewel.description;
          p.innerHTML = "What I bought: " + jewel.materials;
          console.log("edit mant")
          console.log(jewel.materials);
}




const addCommentBoxes = (e) => {
  e.preventDefault();
  console.log("adding jewel");
  const jewelBoxes = document.getElementById("comment-boxes");
  const input = document.createElement("input");
  input.type = "text";
  jewelBoxes.append(input);
};

const editJewelryBoxes = (e) => {
  e.preventDefault();
  console.log("adding jewel");
  const jewelBoxes = document.getElementById("edit-jewel-boxes");
  const input = document.createElement("input");
  input.type = "text";
  jewelBoxes.append(input);
};




const populateEditForm = (jewel) => {
  console.log("populatededitform");
  const form = document.getElementById("edit-JEWELS-form");
  form._id.value = jewel._id;
  form.name.value = jewel.name;
  form.description.value = jewel.description;
 // form.materials.value = jewel.materials;

  //add materials
  populateJewels(jewel.materials);
  document.getElementById("delete-jewelry-link").onclick = async () =>{
      
  populateEditForm(jewel);
  let response = await fetch(`/api/comments/${form._id.value}`, {
      method: "DELETE",
      headers : {
          "Content-Type":"application/json;charset=utf-8"
      }
  }) ;
  if(response.status != 200){
      console.log("bad delete");
      return
  };
  resetForm();
  showJewels();

  };

  //
  
  
};

const populateJewels = (materials) => {
  const section = document.getElementById("edit-jewel-boxes");
  section.innerHTML = " "; 
  materials.forEach((material)=> {//didnt need .materials or .jewels; it gave an error
      const input = document.createElement("input");
      input.type = "text";
      input.value = material;
      section.append(input);
  });
  
  //const sec = document.getElementById("edit-jewel-boxes");
  
    
};

const resetForm = () => {
  const form = document.getElementById("edit-JEWELS-form");
  form.reset();
  form._id = "-1";
  document.getElementById("edit-jewel-boxes").innerHTML = "";
};