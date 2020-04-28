<template>
	<view class="login-wrap">
		<!-- form  -->
		<form>
			<view class="login-username place ">
				<label class="user-style" for="username">
					查找联系人 :
				</label>
				<input type="text" placeholder="请输入邮箱" id="username" v-model="username" />
			</view>
			<view class="find-peo" v-if="!isShow">
				<view class="find-peo-box">
					<image :src="findUser.avator || avator" mode=""></image>
					<text>{{findUser.name}}</text>
				</view>
				<view class="icon-wrap" @tap="add">
					<image src="../../../../static/tabbar/对号.png" mode=""></image>
				</view>
			</view>
			<button class="submit" @tap="loginSubmit">Find</button>
		</form>
	</view>
</template>

<script>
	import interfaces from '../../../../utils/interfaces.js'
	export default {
		data() {
			return {
				username: "",
				findUser: {},
				avator: "https://avatar.bbs.miui.com/images/noavatar_small.gif",
				isShow: true,
			}
		},
		methods: {
			add() {
				const sign = uni.getStorageSync("sign")
				const token = uni.getStorageSync("currentUser")
				const id = uni.getStorageSync("id")
				if(id == this.findUser._id){
					uni.showToast({
						title:"不能添加自己为好友",
						icon:"none"
					})
				}
				else {
				this.request({
					url: interfaces.friend_add,
					method: "POST",
					header: {
						'Authorization': JSON.parse(token).Token
					},
					data: {
						friend_name: this.findUser.name,
						friend_avatar: this.findUser.avatar,
						friend_email: this.findUser.email,
						friend_id: this.findUser._id,
						current_user_id: id
					},
					success: (result) => {
						if (result.msg_friend) {
							uni.showToast({
								title: result.msg_friend,
								icon: "none"
							})
						}
						if (result.msg) {
							uni.showToast({
								title: result.msg,
								icon: "none"
							})
						  this.timeId=setTimeout(()=>{
								uni.switchTab({
									url:"../../people/people"
								})
							},2000)
						}
					}
				})	
				}
			},
			loginSubmit() {

				if (!this.username) {
					uni.showToast({
						icon: "none",
						title: "输入不能为空"
					})
					return
				}
				if (!this.$validate.isEmail(this.username)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的邮箱格式'
					})
					return
				}
				this.request({

					url: interfaces.user_find_people,
					method: "POST",
					data: {
						email: this.username
					},
					success: (result) => {
						if (result.msg) {
							uni.showToast({
								icon: "none",
								title: result.msg
							})
						} else {
							this.findUser = {}
							this.findUser = result
							console.log(this.findUser)
							this.isShow = false
						}
					}
				})
			}
		},
		destroyed() {
			clearTimeout(this.timeId)
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

		.place {
			border-bottom: 1px solid #4257bc;
			margin-bottom: 50upx;

			input {
				width: 100%;
				height: 60upx;
				display: flex;
				padding: 50upx 0;
			}
		}

		.submit {
			width: 90%;
			color: #4257bc;
		}

		.find-peo {
			width: 92%;
			height: 40upx;
			padding: 20upx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 20upx;

			.find-peo-box {
				display: flex;
				align-items: center;

				image {
					width: 66upx;
					height: 66upx;
					border-radius: 50%;
				}

				text {
					color: #4257bc;
					font-size: 34upx;
					margin-left: 30upx;
				}
			}

			.icon-wrap {
				display: flex;
				align-items: center;

				image {
					width: 44upx;
					height: 44upx;
				}
			}
		}
	}
</style>
