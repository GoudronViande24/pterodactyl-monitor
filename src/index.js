const headers = {
	"content-type": "application/json;charset=UTF-8",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET",
};

export default {
	/**
	 * @param {Request} request 
	 * @param {object} env 
	 * @returns {Response}
	 */
	async fetch(request, { PTERO_URL, PTERO_TOKEN }) {
		const requestURL = new URL(request.url);
		const parameters = requestURL.searchParams;
		const response = {
			pteroUrl: PTERO_URL
		};
		let status = 200;

		try {
			if (parameters.has("id")) {
				let data = await fetch(`${PTERO_URL}/api/client/servers/${parameters.get("id")}/resources`, {
					method: "GET",
					headers: {
						"Accept": "application/json",
						"Authorization": "Bearer " + PTERO_TOKEN
					}
				});

				data = await data.json();

				response.state = data.attributes.current_state;

				if (response.state != "running") status = 503;
			} else {
				status = 400;
			}
		} catch (e) {
			status = 504;
		}

		response.status = status;
		return new Response(JSON.stringify(response), { headers, status });
	}
};
