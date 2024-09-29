import { registerApplication, start } from 'single-spa'
import { constructApplications, constructRoutes, constructLayoutEngine } from 'single-spa-layout'

const fetchedMicrofrontends = [
	{
		name: '@MEA/React-MicroFrontend',
		url: '//localhost:8080/MEA-React-MicroFrontend.js',
	},
	{
		name: '@MEA/React-MicroFrontend2',
		url: '//localhost:8081/MEA-React-MicroFrontend2.js',
	},
]

const layoutHTML = `
		  <single-spa-router>
			<main>
			  <route default>
				<h1>Hello from Container</h1>
				${fetchedMicrofrontends.map((mf) => `<application name="${mf.name}"></application>`).join('\n')}
			  </route>
			</main>
		  </single-spa-router>
		`

const parser = new DOMParser()
const layoutDocument = parser.parseFromString(layoutHTML, 'text/html')
const routes = constructRoutes(layoutDocument.querySelector('single-spa-router'))

const applications = constructApplications({
	routes,
	loadApp({ name }) {
		return System.import(name)
	},
})
const layoutEngine = constructLayoutEngine({ routes, applications })

applications.forEach(registerApplication)
layoutEngine.activate()
start()
