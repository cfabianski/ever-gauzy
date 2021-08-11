import * as loginPage from '../../Base/pages/Login.po';
import { LoginPageData } from '../../Base/pagedata/LoginPageData';
import * as timeTrackingPage from '../../Base/pages/TimeTracking.po';
import { TimeTrackingPageData } from '../../Base/pagedata/TimeTrackingPageData';
import * as dashboardPage from '../../Base/pages/Dashboard.po';
import { CustomCommands } from '../../commands';
import * as timesheetsPage from '../../Base/pages/Timesheets.po';
import { TimesheetsPageData } from '../../Base/pagedata/TimesheetsPageData';
import * as logoutPage from '../../Base/pages/Logout.po';
import * as organizationTagsUserPage from '../../Base/pages/OrganizationTags.po';
import { OrganizationTagsPageData } from '../../Base/pagedata/OrganizationTagsPageData';
import * as faker from 'faker';
import { ClientsData } from '../../Base/pagedata/ClientsPageData';
import * as clientsPage from '../../Base/pages/Clients.po';
import * as manageEmployeesPage from '../../Base/pages/ManageEmployees.po';

import { Given, Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { waitUntil } from '../../Base/utils/util';

const pageLoadTimeout = Cypress.config('pageLoadTimeout');

let email = faker.internet.email();
let fullName = faker.name.firstName() + ' ' + faker.name.lastName();
let city = faker.address.city();
let postcode = faker.address.zipCode();
let street = faker.address.streetAddress();
let website = faker.internet.url();

let firstName = faker.name.firstName();
let lastName = faker.name.lastName();
let username = faker.internet.userName();
let password = faker.internet.password();
let employeeEmail = faker.internet.email();
let imgUrl = faker.image.avatar();

// Login with email
Given('Login with default credentials', () => {
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
});

// Add new tag
Then('User can add new tag', () => {
	CustomCommands.addTag(organizationTagsUserPage, OrganizationTagsPageData);
});

// Add employee
And('User can add new employee', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	CustomCommands.addEmployee(
		manageEmployeesPage,
		firstName,
		lastName,
		username,
		employeeEmail,
		password,
		imgUrl
	);
});

// Add new client
And('User can add new client', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	CustomCommands.addClient(
		clientsPage,
		fullName,
		email,
		website,
		city,
		postcode,
		street,
		ClientsData
	);
});

// Add time
And('User can visit Employees timesheets daily page', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	cy.visit('/#/pages/employees/timesheets/daily', {
		timeout: pageLoadTimeout
	});
});

And('User can see add time log button', () => {
	timesheetsPage.addTimeButtonVisible();
});

When('User click on add time log button', () => {
	timesheetsPage.clickAddTimeButton();
});

Then('User can see client dropdown', () => {
	timesheetsPage.clientDropdownVisible();
});

When('User click on client dropdown', () => {
	waitUntil(5000);
	timesheetsPage.clickClientDropdown();
});

Then('User can select client from dropdown options', () => {
	timesheetsPage.selectClientFromDropdown(0);
});

Then('User can see project dropdown', () => {
	timesheetsPage.selectProjectDropdownVisible();
});

When('User click on project dropdown', () => {
	cy.on('uncaught:exception', (err, runnable) => {
		return false;
	});
	timesheetsPage.clickSelectProjectDropdown();
});

Then('User can select project from dropdown options', () => {
	timesheetsPage.selectProjectFromDropdown(
		TimesheetsPageData.defaultProjectName
	);
});

And('User can see task dropdown', () => {
	timesheetsPage.taskDropdownVisible();
});

When('User click on task dropdown', () => {
	timesheetsPage.clickTaskDropdown();
});

Then('User can select task from dropdown options', () => {
	timesheetsPage.selectTaskFromDropdown(0);
});

And('User can see start time dropdown', () => {
	timesheetsPage.startTimeDropdownVisible();
});

When('User click on start time dropdown', () => {
	timesheetsPage.clickStartTimeDropdown();
});

Then('User can select time from dropdown options', () => {
	timesheetsPage.selectTimeFromDropdown(0);
});

Then('User can see date input field', () => {
	timesheetsPage.dateInputVisible();
});

And('User can enter date', () => {
	timesheetsPage.enterDateData();
	timesheetsPage.clickKeyboardButtonByKeyCode(9);
});

And('User can see employee dropdown', () => {
	timesheetsPage.selectEmployeeDropdownVisible();
});

When('User click on employee dropdown', () => {
	timesheetsPage.clickSelectEmployeeDropdown();
});

Then('User can select employee from dropdown options', () => {
	timesheetsPage.selectEmployeeFromDropdown(0);
});

And('User can see time log description input field', () => {
	timesheetsPage.addTimeLogDescriptionVisible();
});

And('User can enter time log description', () => {
	timesheetsPage.enterTimeLogDescriptionData(
		TimesheetsPageData.defaultDescription
	);
});

And('User can see save time log button', () => {
	timesheetsPage.saveTimeLogButtonVisible();
});

When('User click on save time log button', () => {
	timesheetsPage.clickSaveTimeLogButton();
});

Then('Notification message will appear', () => {
	timesheetsPage.waitMessageToHide();
});

// Visit Time tracking page to verify time was added
And('User can visit Time tracking page', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	cy.visit('/#/pages/dashboard/time-tracking', { timeout: pageLoadTimeout });
});

And('User can verify text content', () => {
	timeTrackingPage.headerTextExist(TimeTrackingPageData.header);
	timeTrackingPage.topCardTextExist(TimeTrackingPageData.membersWorked);
	timeTrackingPage.topCardTextExist(TimeTrackingPageData.projectsWorked);
	timeTrackingPage.topCardTextExist(TimeTrackingPageData.weeklyActivity);
	timeTrackingPage.topCardTextExist(TimeTrackingPageData.workedThisWeek);
	timeTrackingPage.topCardTextExist(TimeTrackingPageData.todayActivity);
	timeTrackingPage.topCardTextExist(TimeTrackingPageData.workedToday);
	timeTrackingPage.bottomCardTextExist(TimeTrackingPageData.recentActivities);
	timeTrackingPage.bottomCardTextExist(TimeTrackingPageData.projects);
	timeTrackingPage.bottomCardTextExist(TimeTrackingPageData.tasks);
	timeTrackingPage.bottomCardTextExist(TimeTrackingPageData.appsUrls);
	timeTrackingPage.bottomCardTextExist(TimeTrackingPageData.manualTime);
	timeTrackingPage.bottomCardTextExist(TimeTrackingPageData.members);
});

