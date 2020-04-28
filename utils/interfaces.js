const domain = "http://localhost:5000/chat/";
// const origin = "https://uniapp-interface.herokuapp.com/"
const interfaces = {
     // 用户登录
	 user_login : domain + "users/login",
	 // 用户注册
	 user_register : domain + "users/register",
	 // 当前用户过期时间
	 user_isover : domain + "users/isover",
	 // 私有接口 获取当前用户
	 user_current : domain + "users/current",
	 // 用户上传头像
	 user_avatar : domain + 'users/avator',
	 // 修改用户名
	 user_revise_name : domain + 'users/name',
	 //用户修改密码
	  userUpdatePassword : domain + "users/update/login",
	 
	 
	 
	 
	 
	 
	 
	 // 用户修改信息  
	 
	 // 数据库profile 表
	 
	 revise_profile : domain + "profile",
	 // 根据id  获取 人员信息 
	 
	 profile_all_id :  domain + "profile",
	 
	 
	 
	 
	 
	 // 用户发布动态
	 update : domain + "public",
	 // 用户点赞
	 update_like : domain + "public/like",
	 // 用户评论接口
	 undate_comment : domain + "public/add",
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 // 添加联系人
	 friend_add : domain + "friend/addfriend",
	 
	 // 查找联系人
	 user_find_people : domain + "users/findbyemail",
	 
	 // 获取当前用户的好友
	 
	 friend_current_all : domain + "friend/findcurrentfriend",
	 
	 // 获取 聊天对象的头像 
	 
	 chat_current_avarar_and_friend : domain + "users/chatavatar",
	 
	 
	 // 聊天记录相关
	 
	 chat_list_find :  domain + "chat_detail/findchat",
	 chat_list_add : domain + "chat_detail/add"
	 
}
module.exports = interfaces;
