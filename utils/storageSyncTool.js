const setStorage=(key,value)=>{
  try{
    wx.setStorageSync(key, value)
    return true
  }catch(e){
    return false
  }
}
const getStorage=(key)=>{
  try{
    const value = wx.getStorageSync(key)
    return value
  }catch(e){
    return false
  }
}

const clearStorage=key=>{
  try{
    wx.clearStorageSync(key)
    return true
  }catch(e){
    return false
  }
}
const setLoginToken = (value) => {
  return setStorage(LOGIN_TOKEN_KEY, value)
}

const getLoginToken = () => {
  return getStorage(LOGIN_TOKEN_KEY)
}

const clearLoginToken = () => {
  return clearStorage(LOGIN_TOKEN_KEY)
}

module.exports = {
  setLoginToken,
  getLoginToken,
  getStorage,
  setStorage,
  clearLoginToken,
  clearStorage
}

