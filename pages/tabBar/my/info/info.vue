<template>
	<view>
		<cmd-nav-bar back title="信息设置"></cmd-nav-bar>
		<cmd-page-body type="top">
			<cmd-transition name="fade-up">
				<view>
					<cmd-cel-item title="头像" slot-right arrow>
						<cmd-avatar :src="userImg || initImg" @click="selectImg"></cmd-avatar>
					</cmd-cel-item>
					<cmd-cel-item title="昵称" :addon="second_name" arrow @click="change_second_name" :disabled="false"></cmd-cel-item>
					<cmd-cel-item title="姓名" :addon="realy_name" arrow @click="change_realy_name"></cmd-cel-item>
					<cmd-cel-item title="邮箱" :addon="email" arrow></cmd-cel-item>
					<cmd-cel-item title="签名" :addon="sign" arrow @click="change_sign"></cmd-cel-item>
					<cmd-cel-item title="联系方式" :addon="phone" arrow @click="change_phone"> </cmd-cel-item>
					<prompt ref="prompt" @onConfirm="onConfirm" @onCancel="onCancel" title="提示" :isHidden="isHidden" :index="index"></prompt>
					<button class="btn-logout" @tap="revise_msg">确定</button>
				</view>
			</cmd-transition>
		</cmd-page-body>
	</view>
</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
	import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
	import cmdCelItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	import interfaces from '../../../../utils/interfaces.js'
	import {
		pathToBase64,
		base64ToPath
	} from '../../../../js_sdk/gsq-image-tools/image-tools/index.js'
	import prompt from '../../../../components/promat/index.vue';
	export default {
		components: {
			cmdNavBar,
			cmdPageBody,
			cmdTransition,
			cmdCelItem,
			cmdAvatar,
			prompt
		},

		data() {
			return {
				second_name: "",
				realy_name: "",
				phone: "",
				sign: "",
				initImg: "",
				email: "",
				userImg: "",
				id: "",
				promptText: "",
				isHidden: false,
				cost_side: "",
				index: 0,
				timeId: 0
			};
		},

		mounted() {},
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
										this.second_name = res.name
										console.log(res.name)
										this.email = res.email
										this.userImg = res.avatar
										this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
										this.request({
											url: interfaces.profile_all_id,
											header: {
												'Authorization': JSON.parse(res_token.data).Token
											},
											success: (res) => {
												if (res.realy_name) {
													this.realy_name = res.realy_name
												}
												if (res.sign) {
													this.sign = res.sign
												}
												if (res.phone) {
													this.phone = res.phone.toString()
												}

											}
										})
									}
								})

							} else {
								this.name = "点击登录"

								uni.clearStorageSync();
								uni.navigateTo({
									url: '../../../login/login'
								})
							}
						},
						fail: () => {

							this.name = "点击登录"
							this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
							uni.navigateTo({
								url: '../../../login/login'
							})
						}
					})

				}),
				fail: () => {
					this.name = "点击登录"

				}
			})
		},
		methods: {
			/**
			 * 点击触发
			 * @param {Object} type 跳转页面名或者类型方式
			 */
			prompt: function() {
				this.$refs.prompt.show();
			},
			onConfirm: function(e, index) {
				console.log(e);
				console.log(index)
				let _cost = e;
				if (_cost == '') {
					uni.showToast({
						title: '你还未输入',
						icon: "none"
					})
					return;
				} else {
					this.$refs.prompt.hide();
					this.isHidden = false;
					if (index == 2) {
						this.second_name = _cost
					}
					if (index == 3) {
						this.realy_name = _cost
					}
					if (index == 4) {
						this.sign = _cost
					}
					if (index == 5) {
						this.phone = _cost
					}

				}
			},
			onCancel: function() {
				this.isHidden = false;
				this.$refs.prompt.hide();
				this.$refs.prompt.cost = '';
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
			},
			change_second_name() {
				this.isHidden = true
				this.index = 2;
			},
			change_sign() {
				this.isHidden = true,
					this.index = 4
			},
			change_realy_name() {
				this.isHidden = true
				this.index = 3
			},
			change_phone() {
				this.isHidden = true
				this.index = 5
			},
			revise_msg() {
				// 发起请求 修改
				uni.getStorage({
					key: "currentUser",
					success: (res) => {
						this.request({
							url: interfaces.revise_profile,
							method: "POST",
							header: {
								'Authorization': JSON.parse(res.data).Token
							},
							data: {
								phone: this.phone,
								realy_name: this.realy_name,
								sign: this.sign
							},
							success: (res) => {
								this.request({
									url: interfaces.user_revise_name,
									method: "POST",
									data: {
										_id: this.id,
										name: this.second_name
									},
									success: (res) => {
										uni.showToast({
											title: "修改成功",
											icon: "none"
										})
										this.timeId = setTimeout(() => {
											uni.switchTab({
												url: "../my-main"
											})
										}, 2000)
										return
									}
								})
								uni.showToast({
									title: "修改成功",
									icon: "none"
								})
								this.timeId = setTimeout(() => {
									uni.switchTab({
										url: "../my-main"
									})
								}, 2000)
							}
						})
					}
				})

			}
		},
		destroyed() {
			clearImmediate(this.timeId)
			this.timeId = 0;
		}
	}
</script>

<style>
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
</style>
