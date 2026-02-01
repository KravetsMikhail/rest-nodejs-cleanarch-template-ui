import {
	DataProvider,
	HttpError,
	Pagination,
	CrudSorting,
	CrudFilters,
	CrudOperators,
} from "@refinedev/core";
import { stringify } from "query-string";
import axios, { AxiosInstance } from "axios";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

const axiosInstance = axios.create();

export const coreDataProvider = (
	apiUrl: string,
	// get axios instance from user or use default one.
	httpClient: AxiosInstance = axiosInstance,
): DataProvider => ({
	getOne: async ({ resource, id, meta }) => {
		const url = `${apiUrl}/${resource}/${id}`;

		const { headers, method } = meta ?? {};
		const requestMethod = (method as MethodTypes) ?? "get";

		const { data } = await httpClient[requestMethod](url, { headers });

		return {
			data,
		};
	},

	update: async ({ resource, id, variables, meta }) => {

		//throw new Error("Not implemented");

		const url = `${apiUrl}/${resource}/${id}`;

		const { headers, method } = meta ?? {};
		const requestMethod = (method as MethodTypesWithBody) ?? "put";

		// Remove search field (backend generates it) and convert projectId to string if present
		const { search, ...variablesWithoutSearch } = variables as any;
		const processedVariables: any = {
			...variablesWithoutSearch,
		};
		
		// Only add projectId if it's not empty
		if (variablesWithoutSearch.projectId && variablesWithoutSearch.projectId.trim() !== '') {
			processedVariables.projectId = String(variablesWithoutSearch.projectId);
		}

		console.log('Updating task:', { url, processedVariables });
		console.log('Request headers:', headers);
		console.log('Request method:', requestMethod);
		
		// Log all available headers from httpClient
		console.log('HttpClient defaults:', httpClient.defaults);
		if (httpClient.defaults.headers) {
			console.log('Default headers:', httpClient.defaults.headers);
		}

		const { data } = await httpClient[requestMethod](url, processedVariables, {
			headers,
		});

		console.log('Task updated successfully:', data);

		return {
			data,
		};
	},

	create: async ({ resource, variables, meta }) => {

		//throw new Error("Not implemented");

		const url = `${apiUrl}/${resource}`;

		const { headers, method } = meta ?? {};
		const requestMethod = (method as MethodTypesWithBody) ?? "post";

		// Remove search field ( backend generates it) and convert projectId to string if present
		const { search, ...variablesWithoutSearch } = variables as any;
		const processedVariables: any = {
			...variablesWithoutSearch,
		};
		
		// Only add projectId if it's not empty
		if (variablesWithoutSearch.projectId && variablesWithoutSearch.projectId.trim() !== '') {
			processedVariables.projectId = String(variablesWithoutSearch.projectId);
		} else {
			// Explicitly delete projectId to ensure it's not sent
			delete processedVariables.projectId;
		}
		
		console.log('Original variables:', variables);
		console.log('Variables without search:', variablesWithoutSearch);
		console.log('Processed variables:', processedVariables);

		const response = await httpClient[requestMethod](url, processedVariables, {
			headers,
		});

		console.log('Full response:', response);
		console.log('Response status:', response.status);
		console.log('Response data:', response.data);
		console.log('Response headers:', response.headers);

		return {
			data: response.data,
		};
	},

	deleteOne: async ({ resource, id, variables, meta }) => {

		//throw new Error("Not implemented");

		const url = `${apiUrl}/${resource}/${id}`;

		const { headers, method } = meta ?? {};
		const requestMethod = (method as MethodTypesWithBody) ?? "delete";

		const { data } = await httpClient[requestMethod](url, {
			data: variables,
			headers,
		});

		return {
			data,
		};
	},

	getList: async ({ resource, pagination, sorters, filters, meta }) => {
		const url = `${apiUrl}/${resource}`;

		const { headers: headersFromMeta, method } = meta ?? {};
		const requestMethod = (method as MethodTypes) ?? "get";
	
		console.log('Getting tasks list from:', url);
	
		// init query object for pagination and sorting
		const query: {
			offset?: number;
			limit?: number;
			_sort?: string;
			_order?: string;
		} = {};

		const generatedPagination = generatePagination(pagination);
		if (generatedPagination) {
			const { offset, limit } = generatedPagination;
			query.offset = offset;
			query.limit = limit;
		}

		const generatedSort = generateSort(sorters);
		if (generatedSort) {
			const { _sort, _order } = generatedSort;
			query._sort = _sort.join(",");
			query._order = _order.join(",");
		}

		const queryFilters = generateFilter(filters);

		try {
			const { data, headers } = await httpClient[requestMethod](
				`${url}?${stringify(query)}&${stringify(queryFilters)}`,
				{
					headers: headersFromMeta,
				},
			);
			console.log('Tasks list loaded:', data);
			const total = +headers["x-total-count"];

			return {
				data,
				total: total || data.length,
			};
		} catch (err: any) {
			console.error('Error loading tasks list:', err);
			throw Object.assign(new Error(), {
				...err,
				message: err.response?.data?.message,
				statusCode: err.response?.status,
			});
		}
	},

	getApiUrl: () => apiUrl,
});

// Convert axios errors to HttpError on every response.
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const customError: HttpError = {
			...error,
			message: error.response?.data?.message,
			statusCode: error.response?.status,
		};

		return Promise.reject(customError);
	},
);

// convert Refine CrudOperators to the format that API accepts.
const mapOperator = (operator: CrudOperators): string => {
	switch (operator) {
		case "ne":
		case "gte":
		case "lte":
			return `_${operator}`;
		case "contains":
			return "_like";
		case "eq":
		default:
			return "";
	}
};

// generate query string from Refine CrudFilters to the format that API accepts.
const generateFilter = (filters?: CrudFilters) => {
	const queryFilters: { [key: string]: string } = {};

	if (filters) {
		filters.map((filter) => {
			if (filter.operator === "or" || filter.operator === "and") {
				throw new Error(
					`[@refinedev/simple-rest]: /docs/data/data-provider#creating-a-data-provider`,
				);
			}

			if ("field" in filter) {
				const { field, operator, value } = filter;

				if (field === "q") {
					queryFilters[field] = value;
					return;
				}

				const mappedOperator = mapOperator(operator);
				queryFilters[`${field}${mappedOperator}`] = value;
			}
		});
	}

	return queryFilters;
};

// generate query string from Refine CrudSorting to the format that API accepts.
const generateSort = (sorters?: CrudSorting) => {
	if (sorters && sorters.length > 0) {
		const _sort: string[] = [];
		const _order: string[] = [];

		sorters.map((item) => {
			_sort.push(item.field);
			_order.push(item.order);
		});

		return {
			_sort,
			_order,
		};
	}

	return;
};

// generate query string from Refine Pagination to the format that API accepts.
const generatePagination = (pagination?: Pagination) => {
	// pagination is optional on data hooks, so we need to set default values.
	const { current = 1, pageSize = 10, mode = "server" } = (pagination as any) ?? {};

	const query: {
		offset?: number;
		limit?: number;
	} = {};

	if (mode === "server") {
		query.offset = (current - 1) * pageSize;
		query.limit = current * pageSize;
	}

	return query;
};
