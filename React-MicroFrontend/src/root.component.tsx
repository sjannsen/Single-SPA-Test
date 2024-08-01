// import styles from './root.component.css'
import './root.css'
export default function Root(props) {
	return (
		<div className={'container'}>
			<h1>Hello from React App 1</h1>
			<section>{props.name} is mounted!</section>
		</div>
	)
}
