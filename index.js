const { ApiPromise, WsProvider } = require('@polkadot/api');
import {
	isWeb3Injected,
	web3Accounts,
	web3Enable,
	web3FromAddress
} from "@polkadot/extension-dapp";
web3Enable('polkadot-js/apps');

// Samples
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

		/***
	 * login
	 * @return accounts [{"address":"5D2JMakX2CgtPPkiqUzdsK3Y41vD6HyNy8ZETUjhjRrZFTfG","meta":{"name":"cc1","source":"polkadot-js"}}]

	 */
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
				Promise.all(
				vpnIds.map(({ args: [key1, key2] }) =>
					api.query.web3VpnNft.vpns(key2)
				)
				
			).then((vpnValues_) => {	
								
				var  vpnValues = [];
				for(var vpn_ in vpnValues_){
					const str = JSON.stringify(vpn_);
					const vpn = JSON.parse(str);
					//var vpnPrice = vpnPriceList[i];
					//var vpnUsedCount = vpnUsedCountList[i];
					var vpnJson  = {id: vpnId, exid: vpn.exid , title: vpn.title, maxUser: vpn.max_use, pledge: vpn.pledge  };	
					//console.log("88888:" + JSON.stringify(vpnJson));
					vpnValues.push(vpnJson);
				}
				//var vpnValues = vpnValues_.map(( [exId, title, count, pledge])=> [(Buffer.from(exId.buffer)).toString(), (Buffer.from(title.buffer)).toString(), count, pledge]	);
				
				callback(vpnValues);

			}).catch((error) => {
				console.log(error)
				callback("");
			})
		});
	}



}

window.PolkadotWeb3Url = 'ws://211.159.227.141:9944';
window.PolkadotWeb3JSSample = new PolkadotWeb3JSSample();