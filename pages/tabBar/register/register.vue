<template>
	<view>
		<cmd-nav-bar back title="用户注册"></cmd-nav-bar>
		<cmd-page-body type="top">
			<view class="register">
				<view class="register-title">{{ status ? '手机快捷注册': '账号密码注册'}}</view>
				<cmd-transition name="fade-up">
					<view>
						<view class="register-username">
							<input v-model="account.username" type="" focus maxlength="26" placeholder="请输入用户名" />
						</view>
						<view class="register-email">
							<input v-model="account.email" type="text" focus maxlength="26" placeholder="请输入邮箱" />
						</view>
						<view class="register-password">
							<input v-model="account.password" type="password" displayable maxlength="26" placeholder="请输入密码" />
						</view>
						<button class="btn-register" hover-class="btn-register-hover" @tap="fnRegister">注册</button>
					</view>
				</cmd-transition>
			</view>
		</cmd-page-body>
	</view>

</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
	import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
	import cmdInput from "@/components/cmd-input/cmd-input.vue"
    import interfaces from  '../../../utils/interfaces.js'
	export default {
		components: {
			cmdNavBar,
			cmdPageBody,
			cmdTransition,
			cmdInput
		},

		data() {
			return {
				account: {
					username: '',
					password: '',
					email: ''
				},
				status : false
			};
		},
		methods: {
			/**
			 * 注册按钮点击执行
			 */
			fnRegister() {
				
				this.toCheck(this.account.username, this.account.email, this.account.password)

				if (this.toCheck(this.account.username, this.account.email, this.account.password)) {
					// 将要发起请求 
					this.request({
						url: interfaces.user_register,
						method: 'POST',
						data: {
							name: this.account.username,
							email: this.account.email,
							password: this.account.password
						},
						success: (res) => {
							if (res.callbackEmail) {
								uni.showToast({
									icon: 'none',
									title: res.email
								})
							}
							if (res._id) {
								uni.navigateTo({
									url: '../login/login'
								})
							}

						}
					})
				}
			},
			// 注册前的校验
			toCheck(username, email, password) {
				if (!this.$validate.isName(username)) {
					uni.showToast({
						icon: 'none',
						title: '正确格式的用户名3-6字符'
					})
					return 0
				}
				else if (!this.$validate.isEmail(email)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的邮箱格式'
					})
					return 0
				} else if (!this.$validate.isPwd(password)) {
					uni.showToast({
						icon: 'none',
						title: '请输入6为的密码'
					})
					return 0
				}
				return 1
			}
		}
	}
</script>

<style>
	.register {
		margin-top: 56upx;
		margin-right: 72upx;
		margin-left: 72upx;
	}

	.register-title {
		font-size: 56upx;
		font-weight: 500;
	}

	.register-explain {
		font-size: 28upx;
		color: #9E9E9E;
	}

	.register-phone {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2upx #dedede solid;
		margin-top: 56upx;
		margin-bottom: 40upx;
	}

	.register-phone-getcode {
		color: #3F51B5;
		text-align: center;
		min-width: 140upx;
	}

	.register-code {
		border-bottom: 2upx #dedede solid;
	}

	.register-username {
		margin-top: 56upx;
		margin-bottom: 40upx;
		border-bottom: 2upx #dedede solid;
	}

	.register-email {
		margin-top: 56upx;
		margin-bottom: 40upx;
		border-bottom: 2upx #dedede solid;
	}

	.register-password {
		border-bottom: 2upx #dedede solid;
	}

	.btn-register {
		margin-top: 100upx;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #88a1f9, #9ac6ff);
	}

	.btn-register-active {
		background: linear-gradient(to right, #365fff, #36bbff);
	}

	.btn-register-hover {
		background: linear-gradient(to right, #365fdd, #36bbfa);
	}

	button[disabled] {
		color: #fff;
	}
    input{
		padding: 30upx;
		padding-left: 0;
	}
	.register-mode {
		text-align: center;
		margin-top: 32upx;
	}
</style>
