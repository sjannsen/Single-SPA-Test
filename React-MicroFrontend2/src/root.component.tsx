import './root.css'

export default function Root(props) {
	return (
		<div className="container2">
			<h1>Hello from React App 2</h1>
			<section>{props.name} is mounted!</section>
		</div>
	)
}
