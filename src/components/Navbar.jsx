import React, { useState } from 'react'
import SearchBar from './SearchBar/SearchBar'
import ProfileInfo from './Cards/ProfileInfo'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signOutFailure, signOutStart, signOutSuccess } from '../redux/user/userSlice'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = ({userInfo, onSearchNote, handelClearSearch}) => {
    const [searchQuery, setSearchQuery] = useState("")
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSearch = () => {
      if(searchQuery){
        onSearchNote(searchQuery)
      }
    }
    
    const onClearSearch = () => {
        setSearchQuery("")
        handelClearSearch()
    }

    const onLogout = async() => {
      try {
        dispatch(signOutStart())

        const res = await axios.get("http://localhost:3000/api/auth/signout", {
          withCredentials: true,
        })

        if(res.data.success === false){
          dispatch(signOutFailure(res.data.message))
          toast.error(res.data.message)
          return
        }

        toast.success(res.data.message)
        dispatch(signOutSuccess())
        navigate("/login")
      } 
      catch (error) {
        toast.error(error.message)
        dispatch(signOutFailure(error.message))
      }
    }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <Link to={"/"}>
        <h2 className="text-xl font-medium text-black py-2">
          <span className="text-slate-700">My</span>
          <span className="text-slate-900">Notes</span>
        </h2>
      </Link>

      <SearchBar value={searchQuery} 
        onChange={({target}) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo = {userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Navbar