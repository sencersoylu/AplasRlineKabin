const axios = require('axios');
const Sequelize = require('sequelize');

const tezgah = 'MNT-APT-037';
let isWorkingt = false;

const db_spoiler = new Sequelize('VW_VW_R_LINE', 'a_plas_user', 'bekod123', {
	dialect: 'mssql',
	host: '127.0.0.1',
	port: '1433',
	dialectOptions: {
		options: {
			encrypt: false,
			instanceName: 'SQLEXPRESS',
		},
	},
});

setInterval(async () => {
	try {
		if (isWorkingt) {
			return;
		}

		isWorkingt = true;

		console.log('Bekleyen etiket sorgusu atılıyor...');

		let etiket = await db_spoiler.query(
			'SELECT TOP 1 * FROM R_LINE_TABLO WHERE TERMINAL_AKTAR = 0 and GENEL_DURUM >0;',
			{
				type: db_spoiler.QueryTypes.SELECT,
			}
		);

		etiket = etiket[0];

		if (etiket) {
			console.log('Etiket çıktısı alınıyor...', etiket);

			// await printEtiket(etiket);

			let res = await axios.post(`http://10.44.2.152:4000/uretim`, etiket);

			await db_spoiler.query(
				'UPDATE R_LINE_TABLO SET TERMINAL_AKTAR = 1 WHERE ID = :id',
				{
					type: db_spoiler.QueryTypes.UPDATE,
					replacements: {
						id: etiket.ID,
					},
				}
			);
			isWorkingt = false;
		}
	} catch (err) {
		console.error(err);
	} finally {
		isWorkingt = false;
	}
}, 1250);
