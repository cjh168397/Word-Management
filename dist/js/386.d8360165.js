"use strict";(self["webpackChunkbig_event"]=self["webpackChunkbig_event"]||[]).push([[386],{7386:function(e,s,t){t.r(s),t.d(s,{default:function(){return m}});var r=function(){var e=this,s=e._self._c;return s("div",{staticClass:"login-container"},[s("div",{staticClass:"login-box"},[s("div",{staticClass:"title-box"}),s("el-form",{ref:"loginRef",attrs:{model:e.loginForm,rules:e.loginRules}},[s("el-form-item",{attrs:{prop:"username"}},[s("el-input",{attrs:{placeholder:"请输入用户名",maxlength:"10",minlength:"1"},model:{value:e.loginForm.username,callback:function(s){e.$set(e.loginForm,"username",s)},expression:"loginForm.username"}})],1),s("el-form-item",{attrs:{prop:"password"}},[s("el-input",{attrs:{type:e.eye?"password":"text",placeholder:"请输入密码",maxlength:"15",minlength:"6"},model:{value:e.loginForm.password,callback:function(s){e.$set(e.loginForm,"password",s)},expression:"loginForm.password"}})],1),s("el-form-item",[s("el-button",{staticClass:"btn-login",attrs:{type:"primary"},on:{click:e.loginFn}},[e._v("登录")]),s("el-link",{attrs:{type:"info"},on:{click:function(s){return e.$router.push("/reg")}}},[e._v("去注册")])],1)],1)],1)])},n=[],a=t(7877),o=t(3822),i={name:"my-login",data(){return{loginForm:{username:"",password:""},loginRules:{username:[{required:!0,message:"请输入用户名",trigger:"blur"},{pattern:/^[a-zA-Z0-9]{1,10}$/,message:"用户名必须是1-10的字母数字",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{pattern:/^\S{6,15}$/,message:"密码必须是6-15的非空字符",trigger:"blur"}]}}},methods:{...(0,o.OI)(["updateToken"]),async loginFn(){this.$refs.loginRef.validate((async e=>{if(!e)return;const{data:s}=await(0,a.UO)(this.loginForm);if(0!==s.status)return this.$message.error(s.message);this.$message.success(s.message),this.updateToken(s.token),this.$router.push("/")}))}}},l=i,u=t(1001),g=(0,u.Z)(l,r,n,!1,null,"73c3be96",null),m=g.exports}}]);
//# sourceMappingURL=386.d8360165.js.map