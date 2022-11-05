<template>

<div class="login clearfix">
  <div class="login-wrap">
    <el-row type="flex" justify="center">
      <el-form ref="loginForm" :model="user" status-icon label-width="300px">
        <el-form-item prop="username" label="Username">
          <el-input v-model="user.username" placeholder="Please enter username" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="Email" >
          <el-input v-model="user.email" placeholder="Please enter your email" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item prop="amount" label="Amount">
          <el-input v-model="user.amount" placeholder="Please input the amount to trade" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon @click="doSubmit()">Submit</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon @click="getMyVpns()">getMyVpns</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon @click="getAllAdvertiseVpns()">getAllAdvertiseVpns</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon @click="getMyAdvertiseVpns()">getMyAdvertiseVpns</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>

  
</div>

</template>

<script>
import md5 from 'js-md5';

const { ApiPromise, WsProvider } = require('@polkadot/api');

import {
	isWeb3Injected,
	web3Accounts,
	web3Enable,
	web3FromAddress
} from "@polkadot/extension-dapp";
web3Enable('polkadot-js/apps');

class PolkadotWeb3JSSample {

async getApi() {
  if(!window.polkadotApi){
    const provider = new WsProvider(window.PolkadotWeb3Url);
    //window.api = await ApiPromise.create({ provider });
    window.polkadotApi = await ApiPromise.create({
        provider: provider,
        types: 
        {
          MyText:  "Text",
          SpreadInfo: {
            parent: "Option<T::AccountId>",
            last_height: "T::BlockNumber",
            create_time: "u64"
          },
          ScoreInfo: {
            score: "u128",
            create_time: "u64",
            update_time: "u64"
          },
          VpnId: "u32",
          OrderInfo: {
            vpn_id: "VpnId",
            buyer: "T::AccountId",
            token_md5: "Text",
            client_cfg: "Text",
            update_time: "u64"
          },
          AreaId: "u16",
          Asset: "Text",
          Payload: {
            number: "u64",
            public: "Public"
          },
          AssetId: "Text",
          PoolId: "u64",
          AccountDeposit: {
            amount: "BalanceOf<T>",
            assets: "BTreeMap<T::AssetId, BalanceOf<T>>"
          },
          AssetBalance: {
            asset: "AssetId",
            amount: "BalanceOf<T>"
          },
          AssetSwap: {
            pool_id: "PoolId",
            asset_in: "AssetId",
            amount_in: "Option<Balance>",
            asset_out: "AssetId",
            min_amount_out: "BalanceOf<T>"
          },
          AssetSwapInfo: {
            pool_id: "PoolId",
            asset_in: "AssetId",
            amount_in: "Balance",
            asset_out: "AssetId",
            amount_out: "Balance"
          },
          SwapVolume: {
            input: "Balance",
            output: "Balance"
          },
          BasicPool: {
            asset_ids_to_amounts: "BTreeMap<T::AssetId, BalanceOf<T>>",
            volumes: "BTreeMap<T::AssetId, SwapVolume<BalanceOf<T>>>",
            total_fee: "BalanceOf<T>",
            exchange_fee: "BalanceOf<T>",
            referral_fee: "BalanceOf<T>",
            shares: "BTreeMap<AccountId, BalanceOf<T>>",
            shares_total_supply: "BalanceOf<T>"
          },
          Pool: {
          _enum: {
            BasicPool: "BasicPool"
          }
          },
          DaoId: "u64",
          DaoStatus: {
          _enum: [
            "Proposal",
            "Normal",
            "Finish",
            "Abort"
          ]
          },
          BasicDao: {   
          shares: "BTreeMap<T::AccountId, BalanceOf<T>>",
          supply: "BalanceOf<T>",
          to_supply: "BalanceOf<T>",
          status: "DaoStatus",
          desp: "Text",
          asset_id: "Option<T::AssetId>",
          to_asset_id: "T::AssetId",
          deadline: "T::BlockNumber",
          rate: "u128",
          min: "BalanceOf<T>",
          max: "BalanceOf<T>",
          keep_rate: "u128",
          keep_account: "T::AccountId"
          },
          Dao: {
          _enum: {
            BasicDao: "BasicDao"
          }
          },
          VpnInfo: {
            exid: "Text",
            title: "Text",
            max_use: "u16",
            pledge: "BalanceOf<T>",
            update_time: "u64"
          },
          AdvertiseInfo: {
            area_id: "AreaId",
            title: "Text",
            slogan: "Text",
            ids: "Vec<VpnId>",
            update_time: "u64"
          }
        }
      
      });

  }
  return window.polkadotApi;
}

async login() {
		if (!isWeb3Injected) {
			throw new Error("Please install/unlock the MathWallet first");
		}
		// meta.source contains the name of the extension that provides this account
		const allAccounts = await web3Accounts();
		return allAccounts;
	}


	/***
	 * Remark
	 * @param from from
	 * @param content content
	 * @return hash
	 */
	async proof(from, content) {

		console.log("1111111111111111111111");



		const api = await this.getApi();

		// finds an injector for an address
		const injector = await web3FromAddress(from);

		// sets the signer for the address on the @polkadot/api
		api.setSigner(injector.signer);

		// sign and send out transaction - notice here that the address of the account (as retrieved injected)
		// is passed through as the param to the `signAndSend`, the API then calls the extension to present
		// to the user and get it signed. Once completex, the api sends the tx + signature via the normal process
		const h = api.tx.poeModule
			.createClaim(content)
			.signAndSend(from);

		return h;
	}





	async basicVpnMint(from, exid, title, max_use, pledge,  callback){

		console.log("22222222220111111:" + from);
		const api = await this.getApi();

		const injector = await web3FromAddress(from);
		console.log("222222222202222222222222:");
		// sets the signer for the address on the @polkadot/api
		api.setSigner(injector.signer);

		const txHash = await api.tx.web3VpnNft
          	.mint(exid, title, max_use, pledge)
          	.signAndSend(from, ({ events = [], status }) => {
				if (status.isInBlock) {
				console.log('Successful web3VpnNft of ' + exid + ' with hash ' + status.asInBlock.toHex());
				} else {
				console.log('Status of web3VpnNft: ' + status.type);
				}
			
				events.forEach(({ phase, event }) => {
					console.log("eventInfo:.." + JSON.stringify(event.data));
					callback(event, status);
					//console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
				});
			});
	
		return txHash;

	}
	//todo feng 这个函数到目前，还没用，用的时候代码需要重写一下， 20220-5-5
	async ownerVpns(addr,  callback ) {
		const api = await this.getApi();

		api.query.web3VpnNft.ownerVpns.keys(addr, (vpnIds) => {
			    console.log("222:" + JSON.stringify(vpnIds));
				Promise.all(
				vpnIds.map(({ args: [key1, key2] }) =>
					api.query.web3VpnNft.vpns(key2)
				)
				
			).then((vpnValues_) => {	
				console.log("3333:");		
				console.log(vpnValues_);			
				var  vpnValues = [];
				//var index =0;
				for(var index in vpnValues_){
					//var vpnId = vpnIds[index];
					//index++;
					var vpnId = vpnIds[index];
					var vpn_ = vpnValues_[index];
					const str = JSON.stringify(vpn_);
					console.log("vpn:"+vpnId+":" + str);
					const vpn = JSON.parse(str);
					//var vpnPrice = vpnPriceList[i];
					//var vpnUsedCount = vpnUsedCountList[i];
					var vpnJson  = {id: vpnId, exid: vpn.exid , title: vpn.title, maxUser: vpn.max_use, pledge: vpn.pledge  };	
					//console.log("88888:" + JSON.stringify(vpnJson));
					vpnValues.push(vpnJson);
				}
				//var vpnValues = vpnValues_.map(( [exId, title, count, pledge])=> [(Buffer.from(exId.buffer)).toString(), (Buffer.from(title.buffer)).toString(), count, pledge]	);
				console.log("333:" + JSON.stringify(vpnValues));
				callback(vpnValues);

			}).catch((error) => {
				console.log(error)
				callback("");
			})
		});
	}
	async advertiseVpns(areaId,  callback ) {
		const api = await this.getApi();

		api.query.web3VpnNft.advertiseVpns.keys(areaId, (doubleIds) => {
 			Promise.all(
				doubleIds.map(({ args: [key1, key2] }) =>
					api.query.web3VpnNft.advertiseVpns(key1, key2)
				)
				
			).then((advertiseVpns_) => {	

				//var advertiseVpns = advertiseVpns_.map(( [title, slogan, ids])=> [(Buffer.from(title.buffer)).toString(), (Buffer.from(slogan.buffer)).toString(),  ids]	);

				const str = JSON.stringify(advertiseVpns_);
				//console.log("88888:" + str);
		  		const advertiseVpns = JSON.parse(str);

				var arr = new Array();
				doubleIds.forEach(({ args: [key1, key2] }, index, map) =>{
	 				console.log("user:" + key2+  ", score:" + advertiseVpns[index]);
					arr.push({user:key2, body: advertiseVpns[index]});
	         
				} );
		
				callback(arr);
				//var advertiseVpns = advertiseVpns_.map(( [slogan, vpnIds])=> [(Buffer.from(slogan.buffer)).toString(), vpnIds, count, pledge]	);
				//callback(advertiseVpns);

			}).catch((error) => {
				console.log(error)
				callback("");
			})
		});
	}

	async myAdvertiseVpns_2( areaId, from ) {
		const api = await this.getApi();
		
		const vpns_ = await api.query.web3VpnNft.advertiseVpns(areaId, from);
		const str = JSON.stringify(vpns_);
		const vpns = JSON.parse(str);
		
		return vpns;

	}

	async myAdvertiseVpns(areaId, from,  callback ) {
		const api = await this.getApi();

		api.query.web3VpnNft.advertiseVpns(areaId, from, (vpns_) => {
		  // Calculate the delta
		  console.log( vpns_);
		  const str = JSON.stringify(vpns_);
		  const vpns = JSON.parse(str);

		  console.log('advertiseVpns  ' + JSON.stringify(vpns));
		  callback(vpns);
		});

	}

	async getVpninfo( vpnId ) {
		const api = await this.getApi();
		
		const vpn_ = await api.query.web3VpnNft.vpns(vpnId);
		const str = JSON.stringify(vpn_);
		const vpn = JSON.parse(str);
		const vpnPrice = await api.query.web3VpnNft.vpnPrices(vpnId);
		const vpnUsedCount = await api.query.web3VpnNft.vpnUsedCount(vpnId);	
		var vpnJson = {id: vpnId, exid: vpn.exid, title: vpn.title, maxUser: vpn.max_use, pledge: vpn.pledge , price:vpnPrice, vpnUsedCount:vpnUsedCount  };	
		return {vpn: vpnJson, price: vpnPrice, usedCount: vpnUsedCount};

	}

	async getVpninfoMulti( vpnIds ) {
		const api = await this.getApi();

		var advertiseVpns = [];
				
		const vpnList = await api.query.web3VpnNft.vpns.multi(vpnIds);
		const vpnPriceList = await api.query.web3VpnNft.vpnPrices.multi(vpnIds);
		const vpnUsedCountList = await api.query.web3VpnNft.vpnUsedCount.multi(vpnIds);	
		for(var i in vpnIds){
			var vpnId = vpnIds[i];
			const str = JSON.stringify(vpnList[i]);
			const vpn = JSON.parse(str);
			var vpnPrice = vpnPriceList[i];
			var vpnUsedCount = vpnUsedCountList[i];
			var vpnJson  = {id: vpnId, exid: vpn.exid , title: vpn.title, maxUser: vpn.max_use, pledge: vpn.pledge , price:vpnPrice, vpnUsedCount:vpnUsedCount  };	
			//console.log("88888:" + JSON.stringify(vpnJson));
			advertiseVpns.push(vpnJson);
		}
		
		return advertiseVpns;

	}
}

window.PolkadotWeb3Url = 'ws://121.5.118.181:50944';
window.PolkadotWeb3JSSample = new PolkadotWeb3JSSample();


export default {
  name: "login",
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: ""
      },
    };
  },
  created() {
    // console.log($);
    // console.log("1111");
  },
  methods: {
    doSubmit() {
      if (!this.user.username) {
        this.$message.error("Please enter username!");
        return;
      } else if (!this.user.email) {
        this.$message.error("Please enter your email address!");
        return;
      } else if (this.user.email != null) {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!reg.test(this.user.email)) {
           this.$message.error("Please enter the right email address!");
        } else if (!this.user.amount) {
          this.$message.error("Please enter the amount!");
          return;
        } else if (this.user.amount){
          var reg = /^-?\d*\.?\d+$/;
          if(!reg.test(this.user.amount)){
            this.$message.error("Please enter the right amount!")
          }
        } 
        else {

        var accounts = [];
        var content = "0x"+md5.hex(this.user.username + this.user.email + this.user.amount);

        var from = "5EnHw6XeL41sLa6PHx57Zz4KMh3kdN6BWtdr2kiKu3QhRnZg";
        var exid = "abc";
        var title = "tigle";
        var max_use = 1000;
        var pledge = "aaa";
        window.PolkadotWeb3JSSample.login().then(res => {
          accounts = res;
          console.log("1111");
          console.log(JSON.stringify(accounts));
          if (!accounts || !accounts.length) {
              alert("Please login first");
              return;
          }
          console.log("2222");
          window.PolkadotWeb3JSSample.basicVpnMint(from, exid, title, max_use, pledge,
                  function (  myEvent, status ) {
                          console.log("444444444");
                          console.log(status.type);
                          if(status.type != "InBlock"){//todo 暂只处理Ready, 不处理 Finalized
                                alert("成功");
                          return;}
          }

          )
                .then((hash) => {
                    console.log("55555555555");
                    // console.log(hash);
                })
                .catch(e => {
                    console.log("6666666666666666");
                    alert(e);
                });

        }).catch(e => {
            console.log("7777777777777777");
            console.log(e);
            alert(e);
        }) 
        }
      }
    },
    getMyVpns(){
      var from = "5EnHw6XeL41sLa6PHx57Zz4KMh3kdN6BWtdr2kiKu3QhRnZg";
      window.PolkadotWeb3JSSample.ownerVpns(from,
        function (res) {
          console.log("getVpninfo2222222222222222222222:" + JSON.stringify(res));
          //feng 这里有个严重的bug,  数据  [{"id":1,"exid":"{"b":102400,"c":30,"t":180}","title":"hk-test","maxUser":"0x0190","pledge":"0x0000000000000000000009184e72a000","price":2000000000000,"vpnUsedCount":16}]
          // 在BrowserActivity走一圈到了vpn.html后变成了
          // [{"id":1,"exid":"{"b":102400,"c":30,"t":180}","title":"hk-test","maxUser":"0x0190","pledge":"0x0000000000000000000009184e72a000","price":2000000000000,"vpnUsedCount":16}]
          //所以干脆在这处理了得了
          for (var i = 0; i < res.length; i++) {
            var item = res[i];
            try {
              var exjson = JSON.parse(item.exid);
              item.bandwidth = exjson.b;
              item.cycle = exjson.c;
              item.time = exjson.t;
            } catch (e) {

            }
            item.exid = "";
          }
        }
      ).then((hash) => {
          console.log("55555555555");
          // console.log(hash);
        }).catch(e => {
          console.log("6666666666666666");
          alert(e);
        });
    },
    getAllAdvertiseVpns(){
      var areaId = 86;
      window.PolkadotWeb3JSSample.advertiseVpns(areaId, 
          function (res) {
              console.log("getVpninfo2222222222222222222222:" + JSON.stringify(res));
          }
      )
      .then((hash) => {
          console.log("55555555555");
          // console.log(hash);
      })
      .catch(e => {
          console.log("6666666666666666");
          alert(e);
      });
    },
    getMyAdvertiseVpns(){
    var areaId = 86;
    var from = "5EnHw6XeL41sLa6PHx57Zz4KMh3kdN6BWtdr2kiKu3QhRnZg";
    window.PolkadotWeb3JSSample.myAdvertiseVpns(areaId, from,
        function (res) {
            console.log("getVpninfo2222222222222222222222:" + JSON.stringify(res));
        }
    )
    .then((hash) => {
        console.log("55555555555");
        // console.log(hash);
    })
    .catch(e => {
        console.log("6666666666666666");
        alert(e);
    });    
  }
}};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
