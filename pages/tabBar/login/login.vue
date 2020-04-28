<template>
	<view >
		<cmd-nav-bar  title="用户登录" rightText="注册" @rightText="fnRegisterWin"></cmd-nav-bar>
		<view class="login-wrap">
			<!-- form  -->
			<view class="login-wrap-font">
				账号密码登录
			</view>
			<form>
				<view class="login-username place ">
					<!-- <label class="user-style" for="username">
						邮 箱 :
					</label> -->
					<input type="text" placeholder="请输入邮箱" id="username" v-model="email" />
				</view>
				<view class="login-password place">
					<!-- <label class="user-style" for="password">
						密 码 :
					</label> -->
					<input type="password" placeholder="请输入密码" id="password" v-model="password">
				</view>
				<view class="seat"></view>
				<button class="btn-register" hover-class="btn-register-hover" @tap="loginSubmit">登录</button>
			</form>
		
		</view>
	</view>
</template>

<script>
	import interfaces from  '../../../utils/interfaces.js'
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
	import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
	import cmdInput from "@/components/cmd-input/cmd-input.vue"
	export default {
		data() {
			return {
				email: "",
				password: ""
			}
		},
		methods: {
			fnRegisterWin() {
			  uni.navigateTo({
			    url: '../register/register'
			  })
			},
			loginSubmit() {
				this.toCheck(this.email, this.password)
				if (this.toCheck(this.email, this.password)) {
					// 将要发起请求 
					let obj = {
						email: this.email,
						password: this.password
					}
					this.request({
						url: interfaces.user_login,
						method: 'POST',
						header: {
							'content-type': 'application/json'
						},
						data: {
							email: this.email,
							password: this.password
						},
						success: (res) => {
							if (res.callbackPasspord) {
								uni.showToast({
									icon: 'none',
									title: res.password
								})
							}
							if (res.callbackNoUser) {
								uni.showToast({
									icon: 'none',
									title: res.message
								})
							}
							if (res.success) {
								//  把 token 存到本地
								const token = res.token
								const currentUser = {
									Token: token,
									Time: Date.now() / 1000
								}
								uni.setStorageSync('currentUser', JSON.stringify(currentUser))
								uni.switchTab({
								url:'../my/my-main'
								})
							}
						}
					})
				}
			},
			loginToRegister() {
				uni.navigateTo({
					url:"../register/register"
				})
			},
			toCheck(email, password) {
				if (!this.$validate.isEmail(this.email)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的邮箱格式'
					})
					return 0
				} else if (!this.$validate.isPwd(this.password)) {
					uni.showToast({
						icon: 'none',
						title: '请输入6位的密码'
					})
					return 0
				}
				return 1
			}
		},
		onShow() {
			uni.clearStorage()
			this.email = "",
			this.password= ""
		}
	}
</script>

<style lang="scss" scoped>
	.login-wrap {
		width: 92%;
		padding: 0 4%;
		height: 800upx;
		padding-top: 100upx;
		position: relative;
		overflow-y: hidden;
       .login-wrap-font{
		       font-size: 52upx;
		       font-weight: 500;
	   }
		.place {
			border-bottom: 1px solid #88a1f9;
			margin-bottom: 50upx;

			input {
				width: 100%;
				height: 60upx;
				display: flex;
				padding: 50upx 0;
			}
		}

		.user-style {
			color: #88a1f9;
		}

		.register.place {
			border-bottom: none;
			float: right;
			font-size: 28upx;
			color: #88a1f9;
		}

		.seat {
			width: 92%;
			padding: 0 4%;
			height: 70upx;
		}

		.btn-register {
			
			border-radius: 50upx;
			font-size: 16px;
			color: #fff;
			background: linear-gradient(to right, #88a1f9, #9ac6ff);
		}

	}
</style>