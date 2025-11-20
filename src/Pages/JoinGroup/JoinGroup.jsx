import React, { useContext } from 'react'
import joinGroupbgLight from '../../assets/joinGroupbgLight.png'
import joinGroupbgDark from '../../assets/joinGroupbgDark.png'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const JoinGroup = ({ close4 , theme}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { backendUrl } = useContext(AppContext);

  const onSubmit = async (data) => {
    const payload = {
      groupName:data.groupName,
      groupId:data.groupId,
    };

    try {
      const response = await fetch(`${backendUrl}/api/group/join`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
        credentials:"include",
      });

      const result=await response.json();

      if(result.success){
        toast.success(`${result.message}`);
        close4();
      }
      else{
        toast.error(`${result.message}`);
      }
    } catch (error) {
      console.log("Error joining group : ",error);
      toast.error("Something went wrong. Please try again !");
    }
  };

  return (
    <div
      className="bg-cover bg-center w-[950px] max-w-[95vw] h-120 shadow-xl p-10 relative rounded-3xl flex gap-10"
      style={theme === "light" ? { backgroundImage: `url(${joinGroupbgLight})` } : { backgroundImage: `url(${joinGroupbgDark})` }}
    >
      <div className="pl-10 pt-6 flex flex-col justify-center w-[60%]">
        <h1 className="text-4xl font-bold text-slate-50 drop-shadow-md mb-6">
          Connect, grow, belong
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <p className="text-sm font-medium mb-1 text-white">Group Name</p>
            <input
              type="text"
              placeholder="Ex: Learn React!"
              className={`w-80 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.groupName ? "border-red-500" : "border-orange-400"
              } bg-black/40 text-white placeholder-gray-400 backdrop-blur-md`}
              {...register("groupName", { required: "Group Name is required" })}
            />
            {errors.groupName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.groupName.message}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-1 text-white">Group ID</p>
            <input
              type="text"
              placeholder="Ex: 12345"
              className={`w-80 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.groupID ? "border-red-500" : "border-orange-400"
              } bg-black/40 text-white placeholder-gray-400 backdrop-blur-md`}
              {...register("groupId", { required: "Group ID is required" })}
            />
            {errors.groupID && (
              <p className="text-red-400 text-sm mt-1">
                {errors.groupID.message}
              </p>
            )}
          </div>

          {/* Join Group Button */}
          <button
            type="submit"
            className="w-80 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md transition-colors"
          >
            Join Group
          </button>
        </form>
      </div>

      <div className="pl-6 pt-6 flex-1 relative">
        <button
          onClick={close4}
          className="absolute top-2 right-4 text-white hover:text-red-500 transition-colors text-3xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  )
}

export default JoinGroup
