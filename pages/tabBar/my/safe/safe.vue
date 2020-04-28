<template>
	<view class="profile-name-wrap">
		<view class="profile-name-wrap-input">
			<view class="profile-username">
				老密码 ：
			</view>
			<view class="profile-input">
				<input type="password" value="" placeholder="请输入密码" v-model="old" />
			</view>
		</view>
		<view class="profile-name-wrap-input input-top">
			<view class="profile-username">
				新密码 ：
			</view>
			<view class="profile-input">
				<input type="password" value="" placeholder="请输入密码" v-model="newpas" />
			</view>
		</view>
		<view class="profile-name-wrap-write">
			以英文字母或汉字开头,限4-16个字符,
		</view>
		<view class="profile-name-wrap-button" @tap="changePossword">
			 <button class="btn-logout">提交</button>
		</view>
	</view>
</template>

<script>
	import interfaces from '../../../../utils/interfaces.js'
	export default {
		data() {
			return {
				old: "",
				newpas: "",
				id : ""
			}
		},
		methods: {
			changePossword() {
				if (!this.old || !this.newpas) {
					uni.showToast({
						icon: "none",
						title: "密码格式不对"
					})
				}
				else {
					 const	_self = this
					this.request({
						url: interfaces.userUpdatePassword,
						method: "POST",
						data:{
							_id : _self.id,
							password : _self.old,
							newPassword : _self.newpas
						},
						success(res){
							console.log(res)
							if(res._id){
								uni.clearStorage();
								uni.showToast({
									icon: "none",
									title: "修改成功,请重新登录"
								})
								
								setTimeout(()=>{
									uni.navigateTo({
										url: "../../login/login"
									})
								},1000)
							}
						}
					})
				}
			}
		},
		onShow() {
		 const	_self = this
		 console.log(interfaces.u)
			uni.getStorage({
				key: "currentUser",
				success: (res => {
				  this.request({
				  	url: interfaces.user_current,
				  	header: {
				  		'Authorization': JSON.parse(res.data).Token
				  	},
				  	success(res) {
						_self.id = res.id
				  	}
				  })
			
				})
			})
		}
	}
</script>

<style lang="scss">
	.profile-name-wrap {
		.profile-name-wrap-input {
			width: 100%;
			border-bottom: 1px solid #e6e5e6;
            padding: 20upx;
			.profile-username {
				font-size: 28upx;
			}

			.profile-input {
				margin-top: 22upx;
			}

			&.input-top {
				margin-top: 50upx;
			}
		}

		.profile-name-wrap-write {
			font-size: 28upx;
			text-align: center;
			margin-top: 30upx;
		}

		.profile-name-wrap-button {
			margin-top: 50upx;

			.btn-logout {
			  margin-top: 100upx;
			  width: 80%;
			  border-radius: 50upx;
			  font-size: 16px;
			  color: #fff;
			  background: linear-gradient(to right, #365fff, #36bbff);
			}
			
			.btn-logout-hover {
			  background: linear-gradient(to right, #365fdd, #36bbfa);
			}
		}

	}
</style>
