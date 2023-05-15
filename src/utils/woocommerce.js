import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

const Woocommerce = (config) => {
  return new WooCommerceRestApi({
    url: config.wordpress.baseUrl,
    // consumerKey: 'ck_7e58e70e77db57648b0b3476586b3263b5d3fb22',
    // consumerSecret: 'cs_45471bc5f7ee555f92b149e8cda4def4d9cf7f5d',
    consumerKey: config.wordpress.consumerKey,
    consumerSecret: config.wordpress.consumerSecret,
    version: 'wc/v3',
    axiosConfig: {
      headers: {}
    }
  })
}
export default Woocommerce
