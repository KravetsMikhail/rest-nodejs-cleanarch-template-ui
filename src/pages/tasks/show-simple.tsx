import { useParams } from "react-router";

export function TaskShowSimple() {
	const { id } = useParams();
	console.log('TaskShowSimple - rendering, id:', id);
	
	return (
		<div>
			<h1>Task Show (Simple)</h1>
			<p>Task ID: {id}</p>
			<p>This is a simple component without Refine hooks</p>
		</div>
	);
}
