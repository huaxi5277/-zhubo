<template>
	<view>
		<view class="header">
			<view class="bg">
				<view class="box">
					<view class="box-hd">
						<view class="avator" @tap="selectImg">
							<img :src="userImg || initImg">
						</view>
						<view class="phone-number">{{name}}</view>
					</view>
					<view class="box-bd">
						{{sign}}
					</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<view class="list" @tap="my_card">
				<view class="li noborder">
					<view class="icon">
						<image src="../../../static/wkiwi-user/card.png"></image>
					</view>
					<view class="text">我的名片</view>
					<image class="to" src="../../../static/wkiwi-user/to.png"></image>
				</view>
			</view>
			<view class="list">
				<view class="li " @tap="help">
					<view class="icon">
						<image src="../../../static/wkiwi-user/help.png"></image>
					</view>
					<view class="text">帮助中心</view>
					<image class="to" src="../../../static/wkiwi-user/to.png"></image>
				</view>
				<view class="li " @tap="about">
					<view class="icon">
						<image src="../../../static/wkiwi-user/about.png"></image>
					</view>
					<view class="text">关于我们</view>
					<image class="to" src="../../../static/wkiwi-user/to.png"></image>
				</view>
			</view>
			<view class="list">
				<view class="li noborder" @tap="setting">
					<view class="icon">
						<image src="../../../static/wkiwi-user/set.png"></image>
					</view>
					<view class="text">系统设置</view>
					<image class="to" src="../../../static/wkiwi-user/to.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import interfaces from '../../../utils/interfaces.js'
	import {
		pathToBase64,
		base64ToPath
	} from '../../../js_sdk/gsq-image-tools/image-tools/index.js'
	export default {
		data() {
			return {
				name: "",
				initImg: "",
				email: "",
				userImg: "",
				id: "",
				sign : ""
			};
		},
		onShow() {
			let currentTime = Date.now() / 1000

			uni.getStorage({
				key: "currentUser",
				success: (res_token => {
					// 拿着 token  去 请求 current  拿到 id 
					// 先发起一个请求 
					this.request({
						url: interfaces.user_isover,
						method: "POST",
						data: {
							current: currentTime,
							jwtd: JSON.parse(res_token.data).Token
						},
						success: (result) => {
							if (result.callbackMsg) {
								this.request({
									url: interfaces.user_current,
									method: "GET",
									header: {
										'Authorization': JSON.parse(res_token.data).Token
									},
									success: (res) => {
										this.id = res.id
										uni.setStorageSync("id", res.id)
										this.name = res.name
										this.email = res.email
										this.userImg = res.avatar
										this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
										this.request({
											url : interfaces.profile_all_id,
											header: {
												'Authorization': JSON.parse(res_token.data).Token
											},
											success : (res)=>{
												this.sign = res.sign
											}
										})
									}
								})

							} else {
								this.name = "点击登录"
								this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
								uni.clearStorageSync();
								uni.navigateTo({
									url: '../../../login/login'
								})
								console.log(1)
							}
						},
						fail: () => {
							this.name = "点击登录"
							this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
							uni.clearStorageSync();
							uni.navigateTo({
								url: '../../../login/login'
							})
						}
					})

				}),
				fail: () => {
					this.name = "点击登录"
					this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
					uni.clearStorageSync();
					uni.navigateTo({
						url: '../../login/login'
					})
				}
			})


		},
		onLoad() {},
		methods: {
			my_card() {
				uni.navigateTo({
					url: './info/info'
				})
			},
			setting() {
				uni.navigateTo({
					url: './setting/setting'
				})
			},
			about() {
				uni.navigateTo({
					url: './about/about'
				})
			},
			help() {
				uni.navigateTo({
					url: './help/help'
				})
			},
			selectImg() {
				if (!this.id) {
					return
				} else {
					let that = this
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success: function(res) {
							pathToBase64(res.tempFilePaths[0]).then((base64) => {
								that.request({
									url: interfaces.user_avatar,
									method: "POST",
									data: {
										_id: that.id,
										image: base64
									},
									success: (res) => {
										that.userImg = res.avatar
									},

									fail: () => {
										uni.showToast({
											icon: 'none',
											title: '上传图片过大'
										})
									}
								})
							})
						},
						fail: () => {
							uni.showToast({
								icon: 'none',
								title: '上传失败'
							})
						}
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f1f1f1;
		font-size: 30upx;
	}

	.header {
		background: #fff;
		height: 290upx;
		padding-bottom: 110upx;

		.bg {
			width: 100%;
			height: 200upx;
			padding-top: 100upx;
			background-color: #4191ea;
		}
	}

	.box {
		width: 650upx;
		height: 280upx;
		border-radius: 20upx;
		margin: 0 auto;
		background: #fff;
		box-shadow: 0 5upx 20upx 0upx rgba(0, 0, 150, .2);

		.box-hd {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: center;

			.avator {
				width: 160upx;
				height: 160upx;
				background: #fff;
				border: 5upx solid #fff;
				border-radius: 50%;
				margin-top: -80upx;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.phone-number {
				width: 100%;
				text-align: center;
				margin-top: 28upx;
			}
		}

		.box-bd {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: center;
			margin-top: 40upx;

			.item {
				flex: 1 1 auto;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				justify-content: center;
				border-right: 1px solid #f1f1f1;
				margin: 15upx 0;

				&:last-child {
					border: none;
				}

				.icon {
					width: 60upx;
					height: 60upx;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					width: 100%;
					text-align: center;
					margin-top: 10upx;
				}
			}
		}
	}

	.list-content {
		background: #fff;
	}

	.list {
		width: 100%;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}

		.li {
			width: 92%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;

				image {
					width: 50upx;
					height: 50upx;
				}
			}

			.text {
				padding-left: 20upx;
				width: 100%;
				color: #666;
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx;
			}
		}
	}
</style>
