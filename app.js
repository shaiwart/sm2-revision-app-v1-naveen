// DSA Spaced Repetition Tool - Enhanced with Sub-Categories and Edit Functionality

class DSASpacedRepetitionTool {
	constructor() {
		// Default categories from the application data (CGPSC)
		this.defaultCategories = [
			"Chhattisgarh History",
			"Chhattisgarh Geography",
			"Chhattisgarh Economy",
			"Chhattisgarh Polity & Governance",
			"Chhattisgarh Culture",
			"Indian Polity",
			"Indian History",
			"Indian Geography",
			"Indian Economy",
			"Environment & Ecology",
			"Science & Tech",
			"Current Affairs",
			"International Relations",
			"Constitutional Bodies",
			"Government Schemes",
			"Ethics & Integrity",
		];

		// Default sub-categories
		this.defaultSubCategories = {
			"Chhattisgarh History": [
				"Ancient",
				"Medieval",
				"Modern",
				"Freedom Struggle in CG",
			],
			"Chhattisgarh Geography": [
				"Physical Features",
				"Climate & Rainfall",
				"Rivers & Irrigation",
				"Minerals & Resources",
			],
			"Chhattisgarh Economy": [
				"Agriculture",
				"Industries",
				"Mineral Economy",
				"Infrastructure & Energy",
			],
			"Chhattisgarh Polity & Governance": [
				"State Legislature",
				"Executive",
				"Judiciary",
				"Panchayati Raj",
				"Administration",
			],
			"Chhattisgarh Culture": [
				"Tribes",
				"Festivals",
				"Art & Crafts",
				"Music & Dance",
				"Languages & Literature",
			],
			"Indian Polity": [
				"Constitution",
				"Parliament",
				"Judiciary",
				"Federalism",
				"Local Governance",
			],
			"Indian History": [
				"Ancient",
				"Medieval",
				"Modern",
				"Freedom Struggle",
			],
			"Indian Geography": [
				"Physical",
				"Indian Mapping",
				"Economic Geography",
				"World Geography",
			],
			"Indian Economy": [
				"Macroeconomy",
				"Agriculture",
				"Infrastructure",
				"Banking & Finance",
			],
			"Environment & Ecology": [
				"Biodiversity",
				"Conservation",
				"Climate Change",
				"Pollution & Laws",
			],
			"Science & Tech": [
				"Space",
				"Biotechnology",
				"ICT",
				"Energy",
				"Defense",
			],
			"Current Affairs": [
				"State Affairs",
				"National Affairs",
				"International Affairs",
				"Reports & Indices",
			],
			"International Relations": [
				"India & Neighbours",
				"Global Organizations",
				"Summits & Treaties",
			],
			"Constitutional Bodies": [
				"Election Commission",
				"CAG",
				"UPSC/State PSC",
				"Finance Commission",
			],
			"Government Schemes": [
				"State Schemes",
				"Central Schemes",
				"Welfare Schemes",
				"Agriculture & Rural",
			],
			"Ethics & Integrity": [
				"Ethical Theories",
				"Aptitude & Attitude",
				"Civil Service Values",
				"Case Studies",
			],
		};

		// Sample topics data with sub-categories (CGPSC)
		this.sampleTopics = [
			{
				id: "C1",
				name: "Freedom Fighters of Chhattisgarh",
				category: "Chhattisgarh History",
				subCategory: "Freedom Struggle in CG",
				description:
					"Key leaders like Veer Narayan Singh and their contribution to the freedom struggle in Chhattisgarh",
				easeFactor: 2.3,
				interval: 2,
				repetitions: 1,
				nextReviewDate: "2025-08-02",
				dateAdded: "2025-08-30",
			},
			{
				id: "C2",
				name: "Mineral Wealth of Chhattisgarh",
				category: "Chhattisgarh Geography",
				subCategory: "Minerals & Resources",
				description:
					"Major minerals like coal, iron ore, bauxite; their distribution and role in economy",
				easeFactor: 2.5,
				interval: 3,
				repetitions: 2,
				nextReviewDate: "2025-09-03",
				dateAdded: "2025-08-26",
			},
			{
				id: "C3",
				name: "Tribal Culture of Bastar",
				category: "Chhattisgarh Culture",
				subCategory: "Tribes",
				description:
					"Important tribes, their customs, festivals, and impact on Chhattisgarh’s socio-cultural fabric",
				easeFactor: 2.6,
				interval: 5,
				repetitions: 2,
				nextReviewDate: "2025-08-25",
				dateAdded: "2025-08-20",
			},
			{
				id: "C4",
				name: "State Legislature of Chhattisgarh",
				category: "Chhattisgarh Polity & Governance",
				subCategory: "State Legislature",
				description:
					"Structure, powers, and role of Vidhan Sabha and Vidhan Parishad (if applicable) in governance",
				easeFactor: 2.4,
				interval: 4,
				repetitions: 2,
				nextReviewDate: "2025-08-30",
				dateAdded: "2025-08-23",
			},
			{
				id: "C5",
				name: "Narmada-Son-Mahanadi River System",
				category: "Chhattisgarh Geography",
				subCategory: "Rivers & Irrigation",
				description:
					"River basins, irrigation projects, interlinkages, and their importance for agriculture and economy",
				easeFactor: 2.7,
				interval: 7,
				repetitions: 3,
				nextReviewDate: "2025-09-07",
				dateAdded: "2025-08-18",
			},
			{
				id: "C6",
				name: "Biodiversity Hotspots of Chhattisgarh",
				category: "Environment & Ecology",
				subCategory: "Biodiversity",
				description:
					"Important national parks, sanctuaries like Indravati, Barnawapara; key flora and fauna",
				easeFactor: 2.5,
				interval: 6,
				repetitions: 2,
				nextReviewDate: "2025-09-06",
				dateAdded: "2025-08-22",
			},
		];

		this.topics = [];
		this.categories = [];
		this.subCategories = {};
		this.currentView = "dashboard";
		this.reviewSession = null;
		this.selectedCategoryFilter = "all";
		this.selectedSubCategoryFilter = "all";
		this.editingTopicId = null;
		this.searchQuery = "";
		this.sortOption = "next-asc";
		this.reviewLog = [];
		// Overdue filter controls
		this.overdueDaysFilter = "";
		this.overdueDaysOperator = "gte";

		this.init();
	}

	async init() {
		// this.loadFromLocalStorage();
		await this.loadFromCloud();
		this.initTheme();
		this.bindEvents();
		this.populateCategoryDropdowns();
		this.updateDashboard();
		this.checkOverduePopup();
	}

	// Local Storage Management
	loadFromLocalStorage() {
		try {
			const savedTopics = localStorage.getItem("dsaTool_topics");
			const savedCategories = localStorage.getItem("dsaTool_categories");
			const savedSubCategories = localStorage.getItem(
				"dsaTool_subCategories"
			);

			if (savedTopics) {
				this.topics = JSON.parse(savedTopics);
			} else {
				this.topics = [...this.sampleTopics];
			}

			if (savedCategories) {
				this.categories = JSON.parse(savedCategories);
			} else {
				this.categories = [...this.defaultCategories];
			}

			if (savedSubCategories) {
				this.subCategories = JSON.parse(savedSubCategories);
			} else {
				this.subCategories = { ...this.defaultSubCategories };
			}

			// Always save after loading to ensure data is persisted
			this.saveToCloud();
		} catch (error) {
			console.error("Error loading from localStorage:", error);
			this.topics = [...this.sampleTopics];
			this.categories = [...this.defaultCategories];
			this.subCategories = { ...this.defaultSubCategories };
			this.saveToCloud();
		}
	}

	// saveToCloud() {
	//     try {
	//         localStorage.setItem('dsaTool_topics', JSON.stringify(this.topics));
	//         localStorage.setItem('dsaTool_categories', JSON.stringify(this.categories));
	//         localStorage.setItem('dsaTool_subCategories', JSON.stringify(this.subCategories));
	//     } catch (error) {
	//         console.error('Error saving to localStorage:', error);
	//         this.showAlert('Unable to save data. Your browser storage might be full.', 'error');
	//     }
	// }
	async saveToCloud() {
		const BIN_ID = "68b3d050d0ea881f406ca48b";
		const API_KEY =
			"$2a$10$jbZRSaXjLhmKfqWAR9MSXO/m7BlxcvHIg7sW3KABR.P9EQlrps2Hm";
		try {
			await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-Master-Key": API_KEY,
				},
				body: JSON.stringify({
					topics: this.topics,
					categories: this.categories,
					subCategories: this.subCategories,
					reviewLog: this.reviewLog,
				}),
			});
		} catch (error) {
			console.error("Error saving:", error);
			this.showAlert("Could not save to cloud.", "error");
		}
	}
	async loadFromCloud() {
		const BIN_ID = "68b3d050d0ea881f406ca48b";
		const API_KEY =
			"$2a$10$jbZRSaXjLhmKfqWAR9MSXO/m7BlxcvHIg7sW3KABR.P9EQlrps2Hm";
		try {
			const res = await fetch(
				"https://api.jsonbin.io/v3/b/" + BIN_ID + "/latest",
				{
					headers: { "X-Master-Key": API_KEY },
				}
			);
			const data = await res.json();

			this.topics = data.record.topics || this.sampleTopics;
			this.categories = data.record.categories || this.defaultCategories;
			this.subCategories =
				data.record.subCategories || this.defaultSubCategories;
			this.reviewLog = Array.isArray(data.record.reviewLog)
				? data.record.reviewLog
				: [];
		} catch (error) {
			console.error("Error loading:", error);
			this.topics = [...this.sampleTopics];
			this.categories = [...this.defaultCategories];
			this.subCategories = { ...this.defaultSubCategories };
			this.reviewLog = [];
		}
	}

	// Event Binding
	bindEvents() {
		// Theme toggle
		const themeToggle = document.getElementById("theme-toggle");
		if (themeToggle) {
			themeToggle.addEventListener("click", () => {
				this.toggleTheme();
			});
		}

		// Navigation
		document.querySelectorAll(".nav-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const view = e.target.getAttribute("data-view");
				if (view) {
					this.switchView(view);
				}
			});
		});

		// Add Topic Form
		const addTopicForm = document.getElementById("add-topic-form");
		if (addTopicForm) {
			addTopicForm.addEventListener("submit", (e) => {
				e.preventDefault();
				this.addTopic();
			});
		}

		// Edit Topic Form
		const editTopicForm = document.getElementById("edit-topic-form");
		if (editTopicForm) {
			editTopicForm.addEventListener("submit", (e) => {
				e.preventDefault();
				this.updateTopic();
			});
		}

		// Category checkbox change (Add Topic)
		const addCatsContainer = document.getElementById(
			"topic-additional-categories"
		);
		if (addCatsContainer) {
			addCatsContainer.addEventListener("change", () => {
				this.updateSubcategoryFromSelected("add");
			});
			// Deletions/Edits via event delegation
			addCatsContainer.addEventListener("click", (e) => {
				const editBtn = e.target.closest(
					'button.icon-btn[data-action="edit-category"]'
				);
				if (editBtn) {
					const oldName = editBtn.dataset.category;
					this.showInputDialog({
						title: "Rename Category",
						message: `Update name for "${oldName}"`,
						placeholder: "New category name",
						defaultValue: oldName,
						confirmText: "Update",
					}).then((next) => {
						if (next !== null)
							this.renameCategory(oldName, String(next));
					});
					return;
				}
				const delBtn = e.target.closest(
					'button.icon-btn[data-action="delete-category"]'
				);
				if (delBtn) {
					const cat = delBtn.dataset.category;
					this.confirmAndDeleteCategory(cat);
				}
			});
		}

		// Category checkbox change (Edit Topic)
		const editCatsContainer = document.getElementById(
			"edit-topic-additional-categories"
		);
		if (editCatsContainer) {
			editCatsContainer.addEventListener("change", () => {
				this.updateSubcategoryFromSelected("edit");
			});
			editCatsContainer.addEventListener("click", (e) => {
				const editBtn = e.target.closest(
					'button.icon-btn[data-action="edit-category"]'
				);
				if (editBtn) {
					const oldName = editBtn.dataset.category;
					this.showInputDialog({
						title: "Rename Category",
						message: `Update name for "${oldName}"`,
						placeholder: "New category name",
						defaultValue: oldName,
						confirmText: "Update",
					}).then((next) => {
						if (next !== null)
							this.renameCategory(oldName, String(next));
					});
					return;
				}
				const delBtn = e.target.closest(
					'button.icon-btn[data-action="delete-category"]'
				);
				if (delBtn) {
					const cat = delBtn.dataset.category;
					this.confirmAndDeleteCategory(cat);
				}
			});
		}

		// Sub-category selection change for Add Topic
		const subcatsContainer = document.getElementById("topic-subcategories");
		if (subcatsContainer) {
			subcatsContainer.addEventListener("click", (e) => {
				const editBtn = e.target.closest(
					'button.icon-btn[data-action="edit-subcategory"]'
				);
				if (editBtn) {
					const old = editBtn.dataset.subcategory;
					const parents = (editBtn.dataset.parents || "")
						.split(",")
						.filter(Boolean);
					this.showInputDialog({
						title: "Rename Sub-Category",
						message: `Update name for "${old}"`,
						placeholder: "New sub-category name",
						defaultValue: old,
						confirmText: "Update",
					}).then((next) => {
						if (next !== null)
							this.renameSubCategory(old, String(next), parents);
					});
					return;
				}
				const delBtn = e.target.closest(
					'button.icon-btn[data-action="delete-subcategory"]'
				);
				if (delBtn) {
					const sub = delBtn.dataset.subcategory;
					const parents = (delBtn.dataset.parents || "")
						.split(",")
						.filter(Boolean);
					this.confirmAndDeleteSubCategory(sub, parents);
				}
			});
		}

		// Sub-category selection change for Edit Topic
		const editSubcatsContainer = document.getElementById(
			"edit-topic-subcategories"
		);
		if (editSubcatsContainer) {
			editSubcatsContainer.addEventListener("click", (e) => {
				const editBtn = e.target.closest(
					'button.icon-btn[data-action="edit-subcategory"]'
				);
				if (editBtn) {
					const old = editBtn.dataset.subcategory;
					const parents = (editBtn.dataset.parents || "")
						.split(",")
						.filter(Boolean);
					this.showInputDialog({
						title: "Rename Sub-Category",
						message: `Update name for "${old}"`,
						placeholder: "New sub-category name",
						defaultValue: old,
						confirmText: "Update",
					}).then((next) => {
						if (next !== null)
							this.renameSubCategory(old, String(next), parents);
					});
					return;
				}
				const delBtn = e.target.closest(
					'button.icon-btn[data-action="delete-subcategory"]'
				);
				if (delBtn) {
					const sub = delBtn.dataset.subcategory;
					const parents = (delBtn.dataset.parents || "")
						.split(",")
						.filter(Boolean);
					this.confirmAndDeleteSubCategory(sub, parents);
				}
			});
		}

		// Category filter change
		const categoryFilter = document.getElementById("category-filter");
		if (categoryFilter) {
			categoryFilter.addEventListener("change", (e) => {
				this.selectedCategoryFilter = e.target.value;
				this.updateSubCategoryFilter();
				this.updateDashboard();
			});
		}

		// Sub-category filter change
		const subcategoryFilter = document.getElementById("subcategory-filter");
		if (subcategoryFilter) {
			subcategoryFilter.addEventListener("change", (e) => {
				this.selectedSubCategoryFilter = e.target.value;
				this.updateDashboard();
			});
		}

		// Search
		const topicSearch = document.getElementById("topic-search");
		if (topicSearch) {
			const handler = (e) => {
				this.searchQuery = e.target.value || "";
				this.updateDashboard();
			};
			topicSearch.addEventListener("input", handler);
			topicSearch.addEventListener("change", handler);
		}

		// Sort
		const topicSort = document.getElementById("topic-sort");
		if (topicSort) {
			topicSort.addEventListener("change", (e) => {
				this.sortOption = e.target.value || "next-asc";
				this.updateDashboard();
			});
		}
		// Overdue (days) filter change
		const dueDaysFilter = document.getElementById("overdue-days-filter");
		if (dueDaysFilter) {
			const handler = (e) => {
				const v = parseInt(e.target.value, 10);
				this.overdueDaysFilter = Number.isFinite(v) && v >= 0 ? v : "";
				this.updateDashboard();
			};
			dueDaysFilter.addEventListener("input", handler);
			dueDaysFilter.addEventListener("change", handler);
			// reflect current state if any
			if (
				this.overdueDaysFilter !== "" &&
				Number.isFinite(this.overdueDaysFilter)
			) {
				dueDaysFilter.value = String(this.overdueDaysFilter);
			}
		}

		// Overdue operator change (>= or <=)
		const dueDaysOperator = document.getElementById(
			"overdue-days-operator"
		);
		if (dueDaysOperator) {
			const opHandler = (e) => {
				const val =
					e.target && typeof e.target.value === "string"
						? e.target.value.toLowerCase()
						: "";
				this.overdueDaysOperator = val === "lte" ? "lte" : "gte";
				this.updateDashboard();
			};
			dueDaysOperator.addEventListener("change", opHandler);
			// Some browsers fire input for selects; add for consistency
			dueDaysOperator.addEventListener("input", opHandler);
			// set current value from state
			dueDaysOperator.value = this.overdueDaysOperator;
		}

		// Review buttons
		const startReviewBtn = document.getElementById("start-review-btn");
		if (startReviewBtn) {
			startReviewBtn.addEventListener("click", () => {
				this.startReviewSession();
			});
		}

		const endReviewBtn = document.getElementById("end-review-btn");
		if (endReviewBtn) {
			endReviewBtn.addEventListener("click", () => {
				this.endReviewSession();
			});
		}

		// Question picker change
		const questionPicker = document.getElementById("question-picker");
		if (questionPicker) {
			questionPicker.addEventListener("change", (e) => {
				const topicId = e.target.value;
				if (!this.reviewSession || !topicId) return;

				// Only allow selecting from remaining items (not completed)
				const completedIds = new Set(
					this.reviewSession.completed.map((c) => c.topic.id)
				);
				const index = this.reviewSession.items.findIndex(
					(t, i) => t.id === topicId && !completedIds.has(t.id)
				);
				if (index !== -1) {
					this.reviewSession.currentIndex = index;
					this.updateReviewInterface();
				}
			});
		}

		// Difficulty buttons with confirmation
		document.querySelectorAll(".difficulty-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const difficulty = parseInt(
					e.currentTarget.getAttribute("data-difficulty")
				);
				const labels = { 0: "Again", 1: "Hard", 2: "Good", 3: "Easy" };
				const label = labels[difficulty] || "Confirm";
				this.showConfirmDialog({
					title: "Confirm Answer",
					message: `Mark this topic as "${label}"?`,
					confirmText: label,
					cancelText: "Cancel",
				}).then((ok) => {
					if (ok) this.answerReview(difficulty);
				});
			});
		});

		// Review complete actions
		const backToDashboardBtn = document.getElementById("back-to-dashboard");
		if (backToDashboardBtn) {
			backToDashboardBtn.addEventListener("click", () => {
				this.switchView("dashboard");
			});
		}

		const reviewMoreBtn = document.getElementById("review-more");
		if (reviewMoreBtn) {
			reviewMoreBtn.addEventListener("click", () => {
				this.startReviewSession();
			});
		}

		// Cancel add topic
		const cancelBtn = document.getElementById("cancel-add-topic");
		if (cancelBtn) {
			cancelBtn.addEventListener("click", () => {
				this.switchView("dashboard");
			});
		}

		// Modal events
		const closeEditModal = document.getElementById("close-edit-modal");
		if (closeEditModal) {
			closeEditModal.addEventListener("click", () => {
				this.closeEditModal();
			});
		}

		const cancelEditBtn = document.getElementById("cancel-edit-topic");
		if (cancelEditBtn) {
			cancelEditBtn.addEventListener("click", () => {
				this.closeEditModal();
			});
		}

		// Click outside modal to close
		const editModal = document.getElementById("edit-topic-modal");
		if (editModal) {
			editModal.addEventListener("click", (e) => {
				if (e.target === editModal) {
					this.closeEditModal();
				}
			});
		}

		// Add new category buttons
		const addCatBtn = document.getElementById("add-category-btn");
		if (addCatBtn) {
			addCatBtn.addEventListener("click", () => {
				const input = document.getElementById("add-new-category-name");
				const name = input?.value?.trim();
				if (!name)
					return this.showAlert("Enter a category name.", "error");
				const created = this.addNewCategory(name);
				if (created) {
					input.value = "";
					// Auto-check the new category in Add view
					const cb = document.querySelector(
						`#topic-additional-categories input[value="${created}"]`
					);
					if (cb) {
						cb.checked = true;
						this.updateSubcategoryFromSelected("add");
					}
				}
			});
		}
		const editCatBtn = document.getElementById("edit-category-btn");
		if (editCatBtn) {
			editCatBtn.addEventListener("click", () => {
				const input = document.getElementById("edit-new-category-name");
				const name = input?.value?.trim();
				if (!name)
					return this.showAlert("Enter a category name.", "error");
				const created = this.addNewCategory(name);
				if (created) {
					input.value = "";
					// Auto-check the new category in Edit view
					const cb = document.querySelector(
						`#edit-topic-additional-categories input[value="${created}"]`
					);
					if (cb) {
						cb.checked = true;
						this.updateSubcategoryFromSelected("edit");
					}
				}
			});
		}

		// Add new subcategory buttons
		const addSubBtn = document.getElementById("add-subcategory-btn");
		if (addSubBtn) {
			addSubBtn.addEventListener("click", () => {
				const nameInput = document.getElementById(
					"add-new-subcategory-name"
				);
				const parentSel = document.getElementById(
					"add-subcategory-parent"
				);
				const name = nameInput?.value?.trim();
				const parent = parentSel?.value;
				if (!name || !parent)
					return this.showAlert(
						"Enter sub-category and choose parent.",
						"error"
					);
				const created = this.addNewSubCategory(parent, name);
				if (created) {
					nameInput.value = "";
					// If parent is selected in Add view, refresh
					this.updateSubcategoryFromSelected("add");
				}
			});
		}
		const editSubBtn = document.getElementById("edit-subcategory-btn");
		if (editSubBtn) {
			editSubBtn.addEventListener("click", () => {
				const nameInput = document.getElementById(
					"edit-new-subcategory-name"
				);
				const parentSel = document.getElementById(
					"edit-subcategory-parent"
				);
				const name = nameInput?.value?.trim();
				const parent = parentSel?.value;
				if (!name || !parent)
					return this.showAlert(
						"Enter sub-category and choose parent.",
						"error"
					);
				const created = this.addNewSubCategory(parent, name);
				if (created) {
					nameInput.value = "";
					this.updateSubcategoryFromSelected("edit");
				}
			});
		}

		// Make functions available globally for onclick handlers
		window.deleteTopic = (topicId) => this.deleteTopic(topicId);
		window.editTopic = (topicId) => this.openEditModal(topicId);
	}

	// View Management
	switchView(viewName) {
		console.log(`Switching to view: ${viewName}`);

		// Update navigation buttons
		document.querySelectorAll(".nav-btn").forEach((btn) => {
			btn.classList.remove("active");
			if (btn.getAttribute("data-view") === viewName) {
				btn.classList.add("active");
			}
		});

		// Hide all views
		document.querySelectorAll(".view").forEach((view) => {
			view.classList.remove("active");
		});

		// Show target view
		const targetView = document.getElementById(`${viewName}-view`);
		if (targetView) {
			targetView.classList.add("active");
			this.currentView = viewName;

			// Reset forms when switching to add topic view
			if (viewName === "add-topic") {
				this.resetAddTopicForm();
				this.populateCategoryDropdowns();
			}
		}
	}

	// Category Management
	populateCategoryDropdowns() {
		const categorySelect = null; // removed primary select
		const editCategorySelect = null; // removed primary select (edit)
		const additionalCategoriesContainer = document.getElementById(
			"topic-additional-categories"
		);
		const editAdditionalCategoriesContainer = document.getElementById(
			"edit-topic-additional-categories"
		);
		const categoryFilter = document.getElementById("category-filter");

		// Sort categories alphabetically
		const sortedCategories = [...this.categories].sort();

		// Populate add topic dropdown
		// primary category dropdown removed

		// Populate edit topic dropdown
		// edit primary category dropdown removed

		// Helper to render checkboxes for additional categories
		const renderAdditionalCheckboxes = (container, nameAttr) => {
			if (!container) return;
			container.innerHTML = "";
			sortedCategories.forEach((category) => {
				const id = `${nameAttr}-${category
					.replace(/\s+/g, "-")
					.toLowerCase()}`;
				const wrapper = document.createElement("div");
				wrapper.className = "checkbox-item";

				const input = document.createElement("input");
				input.type = "checkbox";
				input.id = id;
				input.name = nameAttr;
				input.value = category;

				const label = document.createElement("label");
				label.setAttribute("for", id);
				label.textContent = category;
				label.title = category;

				const editBtn = document.createElement("button");
				editBtn.type = "button";
				editBtn.className = "icon-btn icon-edit";
				editBtn.setAttribute("aria-label", `Edit category ${category}`);
				editBtn.dataset.action = "edit-category";
				editBtn.dataset.category = category;

				const del = document.createElement("button");
				del.type = "button";
				del.className = "icon-btn icon-trash";
				del.setAttribute("aria-label", `Delete category ${category}`);
				del.textContent = "ðŸ—‘";
				del.dataset.action = "delete-category";
				del.dataset.category = category;

				wrapper.appendChild(input);
				wrapper.appendChild(label);
				wrapper.appendChild(editBtn);
				wrapper.appendChild(del);
				container.appendChild(wrapper);
			});
		};

		// Populate additional categories (checkbox groups)
		renderAdditionalCheckboxes(
			additionalCategoriesContainer,
			"additionalCategories"
		);
		renderAdditionalCheckboxes(
			editAdditionalCategoriesContainer,
			"additionalCategories"
		);

		// After rendering, update subcategory checkbox lists based on current selections
		this.updateSubcategoryFromSelected("add");
		this.updateSubcategoryFromSelected("edit");

		// Populate subcategory parent selects for add/edit subcategory forms
		const addSubParent = document.getElementById("add-subcategory-parent");
		const editSubParent = document.getElementById(
			"edit-subcategory-parent"
		);
		const fillParentSelect = (sel) => {
			if (!sel) return;
			sel.innerHTML = "";
			sortedCategories.forEach((category) => {
				const opt = document.createElement("option");
				opt.value = category;
				opt.textContent = category;
				sel.appendChild(opt);
			});
		};
		fillParentSelect(addSubParent);
		fillParentSelect(editSubParent);

		// Populate filter dropdown
		if (categoryFilter) {
			categoryFilter.innerHTML =
				'<option value="all">All Categories</option>';
			sortedCategories.forEach((category) => {
				const option = document.createElement("option");
				option.value = category;
				option.textContent = category;
				categoryFilter.appendChild(option);
			});

			// Restore selected filter
			categoryFilter.value = this.selectedCategoryFilter;
		}

		// Update sub-category filter after populating categories
		this.updateSubCategoryFilter();
	}

	updateSubCategoryFilter() {
		const subcategoryFilter = document.getElementById("subcategory-filter");
		if (!subcategoryFilter) return;

		if (this.selectedCategoryFilter === "all") {
			subcategoryFilter.disabled = true;
			subcategoryFilter.innerHTML =
				'<option value="all">All Sub-Categories</option>';
			this.selectedSubCategoryFilter = "all";
		} else {
			subcategoryFilter.disabled = false;
			subcategoryFilter.innerHTML =
				'<option value="all">All Sub-Categories</option>';

			const subcategories =
				this.subCategories[this.selectedCategoryFilter] || [];
			const sortedSubCategories = [...subcategories].sort();

			sortedSubCategories.forEach((subcategory) => {
				const option = document.createElement("option");
				option.value = subcategory;
				option.textContent = subcategory;
				subcategoryFilter.appendChild(option);
			});

			// Reset to 'all' when category changes
			this.selectedSubCategoryFilter = "all";
			subcategoryFilter.value = "all";
		}
	}

	handleCategorySelection() {
		/* deprecated: primary category removed */
	}

	// Helper: read selected checkbox categories by context
	getSelectedCategories(context) {
		const containerId =
			context === "edit"
				? "edit-topic-additional-categories"
				: "topic-additional-categories";
		return Array.from(
			document.querySelectorAll(
				`#${containerId} input[type="checkbox"]:checked`
			)
		).map((cb) => cb.value);
	}

	// Update subcategory checkboxes based on selected categories (union)
	updateSubcategoryFromSelected(context) {
		const selected = this.getSelectedCategories(context);
		const containerId =
			context === "edit"
				? "edit-topic-subcategories"
				: "topic-subcategories";
		const container = document.getElementById(containerId);
		if (!container) return;

		// Build mapping subcategory -> parents
		const map = new Map();
		selected.forEach((cat) => {
			(this.subCategories[cat] || []).forEach((sc) => {
				if (!map.has(sc)) map.set(sc, new Set());
				map.get(sc).add(cat);
			});
		});

		const list = Array.from(map.keys()).sort();
		// Render sub-categories using semantic list rows and exit early
		container.innerHTML = list
			.map((subcategory) => {
				const id = `${containerId}-${subcategory
					.replace(/\s+/g, "-")
					.toLowerCase()}`;
				const parents = Array.from(map.get(subcategory)).join(", ");
				const escapedName = this.escapeHtml(subcategory);
				const escapedParents = this.escapeHtml(parents);
				return `
				<li class="subcat-item">
				  <div class="subcat-left">
				    <input type="checkbox" id="${id}" name="subcategories" value="${escapedName}" />
				    <label for="${id}" class="subcat-text">
				      <span class="subcat-name">${escapedName}</span>
				      <small class="subcat-meta">${escapedParents}</small>
				    </label>
				  </div>
				  <div class="subcat-actions">
				    <button type="button" class="icon-btn icon-edit" aria-label="Edit sub-category"
				      data-action="edit-subcategory" data-subcategory="${escapedName}" data-parents="${escapedParents}"></button>
				    <button type="button" class="icon-btn icon-trash" aria-label="Delete sub-category"
				      data-action="delete-subcategory" data-subcategory="${escapedName}" data-parents="${escapedParents}"></button>
				  </div>
				</li>`;
			})
			.join("");
		return;
		list.forEach((subcategory) => {
			const id = `${containerId}-${subcategory
				.replace(/\s+/g, "-")
				.toLowerCase()}`;
			const wrapper = document.createElement("div");
			wrapper.className = "checkbox-item";

			const input = document.createElement("input");
			input.type = "checkbox";
			input.id = id;
			input.name = "subcategories";
			input.value = subcategory;

			const label = document.createElement("label");
			label.setAttribute("for", id);
			label.textContent = subcategory;
			label.title = subcategory;

			const editBtn = document.createElement("button");
			editBtn.type = "button";
			editBtn.className = "icon-btn icon-edit";
			editBtn.dataset.action = "edit-subcategory";
			editBtn.dataset.subcategory = subcategory;
			editBtn.dataset.parents = Array.from(map.get(subcategory)).join(
				","
			);

			const del = document.createElement("button");
			del.type = "button";
			del.className = "icon-btn icon-trash";
			del.textContent = "ðŸ—‘";
			del.dataset.action = "delete-subcategory";
			del.dataset.subcategory = subcategory;
			del.dataset.parents = Array.from(map.get(subcategory)).join(",");

			const meta = document.createElement("small");
			meta.className = "sub-meta";
			meta.textContent = Array.from(map.get(subcategory)).join(", ");

			wrapper.appendChild(input);
			wrapper.appendChild(label);
			wrapper.appendChild(editBtn);
			wrapper.appendChild(del);
			wrapper.appendChild(meta);
			container.appendChild(wrapper);
		});
	}

	populateSubCategoryDropdown(categoryValue, context) {
		const prefix = context === "edit" ? "edit-" : "";
		const subcategorySelect = document.getElementById(
			`${prefix}topic-subcategory`
		);

		if (!subcategorySelect) return;

		if (!categoryValue) {
			subcategorySelect.disabled = true;
			subcategorySelect.innerHTML =
				'<option value="">Select a category first...</option>';
			return;
		}

		subcategorySelect.disabled = false;
		subcategorySelect.innerHTML =
			'<option value="">Select a sub-category...</option>';

		const subcategories = this.subCategories[categoryValue] || [];
		const sortedSubCategories = [...subcategories].sort();

		sortedSubCategories.forEach((subcategory) => {
			const option = document.createElement("option");
			option.value = subcategory;
			option.textContent = subcategory;
			subcategorySelect.appendChild(option);
		});

		// Add "Add New Sub-Category..." option at the end
		const newSubCategoryOption = document.createElement("option");
		newSubCategoryOption.value = "add-new";
		newSubCategoryOption.textContent = "Add New Sub-Category...";
		newSubCategoryOption.style.fontStyle = "italic";
		subcategorySelect.appendChild(newSubCategoryOption);
	}

	handleSubCategorySelection(value, context) {
		const prefix = context === "edit" ? "edit-" : "";
		const newSubCategoryGroup = document.getElementById(
			`${prefix}new-subcategory-group`
		);
		const newSubCategoryInput = document.getElementById(
			`${prefix}new-subcategory-name`
		);

		if (value === "add-new") {
			if (newSubCategoryGroup) {
				newSubCategoryGroup.style.display = "block";
			}
			if (newSubCategoryInput) {
				newSubCategoryInput.setAttribute("required", "required");
				setTimeout(() => newSubCategoryInput.focus(), 100);
			}
		} else {
			if (newSubCategoryGroup) {
				newSubCategoryGroup.style.display = "none";
			}
			if (newSubCategoryInput) {
				newSubCategoryInput.removeAttribute("required");
				newSubCategoryInput.value = "";
			}
		}
	}

	clearCategoryErrors() {
		const existingAlerts = document.querySelectorAll(".alert");
		existingAlerts.forEach((alert) => {
			if (
				alert.textContent.includes("Category") ||
				alert.textContent.includes("category")
			) {
				alert.remove();
			}
		});
	}

	addNewCategory(categoryName) {
		const trimmedName = categoryName.trim();

		if (!trimmedName) {
			this.showAlert("Category name cannot be empty.", "error");
			return false;
		}

		// Check for duplicates (case-insensitive)
		const exists = this.categories.some(
			(cat) => cat.toLowerCase() === trimmedName.toLowerCase()
		);

		if (exists) {
			this.showAlert("Category already exists.", "error");
			return false;
		}

		// Add category and initialize empty sub-categories array
		this.categories.push(trimmedName);
		this.categories.sort(); // Keep categories sorted
		this.subCategories[trimmedName] = [];
		this.saveToCloud();
		this.populateCategoryDropdowns();

		this.showAlert(
			`Category "${trimmedName}" added successfully!`,
			"success"
		);
		return trimmedName;
	}

	addNewSubCategory(categoryName, subCategoryName) {
		const trimmedName = subCategoryName.trim();

		if (!trimmedName) {
			this.showAlert("Sub-category name cannot be empty.", "error");
			return false;
		}

		if (!this.subCategories[categoryName]) {
			this.subCategories[categoryName] = [];
		}

		// Check for duplicates (case-insensitive)
		const exists = this.subCategories[categoryName].some(
			(subCat) => subCat.toLowerCase() === trimmedName.toLowerCase()
		);

		if (exists) {
			this.showAlert(
				"Sub-category already exists in this category.",
				"error"
			);
			return false;
		}

		// Add sub-category and sort
		this.subCategories[categoryName].push(trimmedName);
		this.subCategories[categoryName].sort();
		this.saveToCloud();

		this.showAlert(
			`Sub-category "${trimmedName}" added successfully!`,
			"success"
		);
		return trimmedName;
	}

	// Rename a category across app state with duplicate prevention
	renameCategory(oldName, newNameRaw) {
		if (!oldName) return false;
		const newName = String(newNameRaw || "").trim();
		if (!newName) {
			this.showAlert("Category name cannot be empty.", "error");
			return false;
		}
		// If name unchanged (case-insensitive), no-op
		if (oldName.toLowerCase() === newName.toLowerCase()) {
			this.showAlert("No changes made.", "info");
			return false;
		}
		// Duplicate check (case-insensitive)
		const exists = this.categories.some(
			(c) => c.toLowerCase() === newName.toLowerCase()
		);
		if (exists) {
			this.showAlert("Category already exists.", "error");
			return false;
		}
		// Update categories list
		this.categories = this.categories
			.map((c) => (c === oldName ? newName : c))
			.sort();
		// Move subcategory mapping key
		if (Object.prototype.hasOwnProperty.call(this.subCategories, oldName)) {
			this.subCategories[newName] = this.subCategories[oldName] || [];
			delete this.subCategories[oldName];
		}
		// Update topics
		this.topics = this.topics.map((t) => {
			const cats = Array.isArray(t.categories)
				? t.categories.map((c) => (c === oldName ? newName : c))
				: t.category
				? [t.category === oldName ? newName : t.category]
				: [];
			return {
				...t,
				categories: cats,
				category: cats[0] || "",
			};
		});
		// Update filters if needed
		if (this.selectedCategoryFilter === oldName) {
			this.selectedCategoryFilter = newName;
		}
		// Persist + refresh UI
		this.saveToCloud();
		this.populateCategoryDropdowns();
		this.updateDashboard();
		this.showAlert(
			`Category "${oldName}" renamed to "${newName}".`,
			"success"
		);
		return true;
	}

	// Rename a sub-category across specified parents (or all parents containing it)
	renameSubCategory(oldSub, newSubRaw, parentCategories = []) {
		const newSub = String(newSubRaw || "").trim();
		if (!oldSub) return false;
		if (!newSub) {
			this.showAlert("Sub-category name cannot be empty.", "error");
			return false;
		}
		if (oldSub.toLowerCase() === newSub.toLowerCase()) {
			this.showAlert("No changes made.", "info");
			return false;
		}
		// Determine parents to apply change
		let parents =
			parentCategories && parentCategories.length
				? parentCategories
				: Object.keys(this.subCategories).filter((k) =>
						(this.subCategories[k] || []).some(
							(s) => s.toLowerCase() === oldSub.toLowerCase()
						)
				  );
		if (!parents.length) return false;
		// Duplicate check per parent (case-insensitive)
		const conflict = parents.some((cat) =>
			(this.subCategories[cat] || []).some(
				(s) => s.toLowerCase() === newSub.toLowerCase() && s !== oldSub
			)
		);
		if (conflict) {
			this.showAlert(
				"Sub-category already exists under one of the selected parents.",
				"error"
			);
			return false;
		}
		// Apply rename in mapping
		parents.forEach((cat) => {
			this.subCategories[cat] = (this.subCategories[cat] || [])
				.map((s) => (s === oldSub ? newSub : s))
				.sort();
		});
		// Update topics
		this.topics = this.topics.map((t) => {
			const subs = Array.isArray(t.subCategories)
				? t.subCategories.map((s) => (s === oldSub ? newSub : s))
				: t.subCategory
				? [t.subCategory === oldSub ? newSub : t.subCategory]
				: [];
			return {
				...t,
				subCategories: subs,
				subCategory: subs[0] || "",
			};
		});
		if (this.selectedSubCategoryFilter === oldSub) {
			this.selectedSubCategoryFilter = newSub;
		}
		// Persist + refresh UI
		this.saveToCloud();
		this.updateSubcategoryFromSelected("add");
		this.updateSubcategoryFromSelected("edit");
		this.updateDashboard();
		this.showAlert(
			`Sub-category "${oldSub}" renamed to "${newSub}".`,
			"success"
		);
		return true;
	}

	// Friendly confirm modal. Returns Promise<boolean>
	showConfirmDialog({
		title = "Confirm",
		message = "Are you sure?",
		confirmText = "Confirm",
		cancelText = "Cancel",
	} = {}) {
		return new Promise((resolve) => {
			const modal = document.getElementById("confirm-modal");
			const titleEl = document.getElementById("confirm-modal-title");
			const msgEl = document.getElementById("confirm-modal-message");
			const btnConfirm = document.getElementById("confirm-modal-confirm");
			const btnCancel = document.getElementById("confirm-modal-cancel");
			const btnClose = document.getElementById("confirm-modal-close");

			if (
				!modal ||
				!titleEl ||
				!msgEl ||
				!btnConfirm ||
				!btnCancel ||
				!btnClose
			) {
				// Fallback to browser confirm if modal elements missing
				resolve(window.confirm(message));
				return;
			}

			const cleanup = () => {
				modal.classList.add("hidden");
				btnConfirm.removeEventListener("click", onConfirm);
				btnCancel.removeEventListener("click", onCancel);
				btnClose.removeEventListener("click", onCancel);
				modal.removeEventListener("click", onBackdrop);
				document.removeEventListener("keydown", onKey);
			};
			const onConfirm = () => {
				cleanup();
				resolve(true);
			};
			const onCancel = () => {
				cleanup();
				resolve(false);
			};
			const onBackdrop = (e) => {
				if (e.target === modal) onCancel();
			};
			const onKey = (e) => {
				if (e.key === "Escape") onCancel();
				if (e.key === "Enter") onConfirm();
			};

			titleEl.textContent = title;
			msgEl.textContent = message;
			btnConfirm.textContent = confirmText;
			btnCancel.textContent = cancelText;

			btnConfirm.addEventListener("click", onConfirm);
			btnCancel.addEventListener("click", onCancel);
			btnClose.addEventListener("click", onCancel);
			modal.addEventListener("click", onBackdrop);
			document.addEventListener("keydown", onKey);

			modal.classList.remove("hidden");
		});
	}

	// Input modal: returns Promise<string|null> for entered value
	showInputDialog({
		title = "Update",
		message = "Enter a new value",
		placeholder = "",
		defaultValue = "",
		confirmText = "Update",
		cancelText = "Cancel",
	} = {}) {
		return new Promise((resolve) => {
			const modal = document.getElementById("input-modal");
			const titleEl = document.getElementById("input-modal-title");
			const msgEl = document.getElementById("input-modal-message");
			const inputEl = document.getElementById("input-modal-input");
			const btnConfirm = document.getElementById("input-modal-confirm");
			const btnCancel = document.getElementById("input-modal-cancel");
			const btnClose = document.getElementById("input-modal-close");

			if (
				!modal ||
				!titleEl ||
				!msgEl ||
				!inputEl ||
				!btnConfirm ||
				!btnCancel ||
				!btnClose
			) {
				const val = window.prompt(message, defaultValue);
				resolve(val === null ? null : String(val));
				return;
			}

			const cleanup = () => {
				modal.classList.add("hidden");
				btnConfirm.removeEventListener("click", onConfirm);
				btnCancel.removeEventListener("click", onCancel);
				btnClose.removeEventListener("click", onCancel);
				modal.removeEventListener("click", onBackdrop);
				inputEl.removeEventListener("input", onInput);
				document.removeEventListener("keydown", onKey);
			};

			const onConfirm = () => {
				const v = (inputEl.value || "").trim();
				if (!v) {
					inputEl.focus();
					return;
				}
				cleanup();
				resolve(v);
			};
			const onCancel = () => {
				cleanup();
				resolve(null);
			};
			const onBackdrop = (e) => {
				if (e.target === modal) onCancel();
			};
			const onKey = (e) => {
				if (e.key === "Escape") onCancel();
				if (e.key === "Enter") onConfirm();
			};
			const onInput = () => {
				btnConfirm.disabled = (inputEl.value || "").trim().length === 0;
			};

			titleEl.textContent = title;
			msgEl.textContent = message;
			inputEl.placeholder = placeholder || "";
			inputEl.value = defaultValue || "";
			btnConfirm.textContent = confirmText;
			btnCancel.textContent = cancelText;
			btnConfirm.disabled = (inputEl.value || "").trim().length === 0;

			btnConfirm.addEventListener("click", onConfirm);
			btnCancel.addEventListener("click", onCancel);
			btnClose.addEventListener("click", onCancel);
			modal.addEventListener("click", onBackdrop);
			document.addEventListener("keydown", onKey);
			inputEl.addEventListener("input", onInput);

			modal.classList.remove("hidden");
			setTimeout(() => inputEl.focus(), 0);
		});
	}

	confirmAndDeleteCategory(categoryName) {
		if (!categoryName) return;
		this.showConfirmDialog({
			title: "Delete Category",
			message: `Are you sure you want to delete the category "${categoryName}"? It will be removed from all topics.`,
			confirmText: "Delete",
			cancelText: "Cancel",
		}).then((ok) => {
			if (!ok) return;

			// Remove from categories list and mapping
			this.categories = this.categories.filter((c) => c !== categoryName);
			delete this.subCategories[categoryName];

			// Remove from topics' categories
			this.topics = this.topics.map((t) => {
				const cats = Array.isArray(t.categories)
					? t.categories.filter((c) => c !== categoryName)
					: t.category && t.category !== categoryName
					? [t.category]
					: [];
				const primary = cats[0] || "";
				return { ...t, categories: cats, category: primary };
			});

			this.saveToCloud();
			this.populateCategoryDropdowns();
			this.updateDashboard();
			this.showAlert(`Category "${categoryName}" deleted.`, "success");
		});
	}

	confirmAndDeleteSubCategory(subCategoryName, parentCategories = []) {
		if (!subCategoryName) return;
		// Determine parents: if none provided, delete across all categories
		let parents =
			parentCategories && parentCategories.length
				? parentCategories
				: Object.keys(this.subCategories).filter((k) =>
						(this.subCategories[k] || []).includes(subCategoryName)
				  );
		if (parents.length === 0) return;

		const parentList = parents.join(", ");
		this.showConfirmDialog({
			title: "Delete Sub-Category",
			message: `Delete sub-category "${subCategoryName}" from: ${parentList}?`,
			confirmText: "Delete",
			cancelText: "Cancel",
		}).then((ok) => {
			if (!ok) return;

			parents.forEach((cat) => {
				this.subCategories[cat] = (
					this.subCategories[cat] || []
				).filter((sc) => sc !== subCategoryName);
			});

			// Remove from topics' subCategories arrays
			this.topics = this.topics.map((t) => {
				const subs = Array.isArray(t.subCategories)
					? t.subCategories.filter((s) => s !== subCategoryName)
					: t.subCategory && t.subCategory !== subCategoryName
					? [t.subCategory]
					: [];
				return {
					...t,
					subCategories: subs,
					subCategory: subs[0] || "",
				};
			});

			this.saveToCloud();
			this.updateSubcategoryFromSelected("add");
			this.updateSubcategoryFromSelected("edit");
			this.updateDashboard();
			this.showAlert(
				`Sub-category "${subCategoryName}" deleted.`,
				"success"
			);
		});
	}

	// Topic Management
	addTopic() {
		console.log("Adding topic...");

		const form = document.getElementById("add-topic-form");
		if (!form) {
			this.showAlert("Form not found.", "error");
			return;
		}

		const formData = new FormData(form);

		const name = formData.get("name")?.trim() || "";
		// Sub-categories via checkboxes
		const selectedSubCategories = Array.from(
			document.querySelectorAll(
				'#topic-subcategories input[type="checkbox"]:checked'
			)
		).map((cb) => cb.value);
		const newSubCategoryName = formData.get("newSubcategory")?.trim() || "";
		const description = formData.get("description")?.trim() || "";
		// Get additional categories selections (checkboxes)
		const additionalCategories = Array.from(
			document.querySelectorAll(
				'#topic-additional-categories input[type="checkbox"]:checked'
			)
		).map((cb) => cb.value);

		// Validate topic name
		if (!name) {
			this.showAlert("Topic name is required.", "error");
			return;
		}

		// Validate category selection (at least one checkbox)
		if (!additionalCategories || additionalCategories.length === 0) {
			this.showAlert("Please select at least one category.", "error");
			return;
		}

		// Optional sub-categories (multi-select)
		let finalSubCategories = [...selectedSubCategories];

		// Check for duplicate topic names (case-insensitive)
		const exists = this.topics.some(
			(topic) => topic.name.toLowerCase() === name.toLowerCase()
		);

		if (exists) {
			this.showAlert("A topic with this name already exists.", "error");
			return;
		}

		// Create new topic
		const categories = Array.from(new Set(additionalCategories));
		const newTopic = {
			id: Date.now().toString(),
			name: name,
			category: categories[0] || "", // keep first for backward compatibility
			categories: categories,
			subCategory: finalSubCategories[0] || "",
			subCategories: finalSubCategories,
			description: description,
			easeFactor: 2.5,
			interval: 0,
			repetitions: 0,
			nextReviewDate: this.getCurrentDate(),
			dateAdded: this.getCurrentDate(),
			lastReviewedDate: "",
		};

		console.log("Created new topic:", newTopic);

		this.topics.push(newTopic);
		this.saveToCloud();

		this.showAlert("Topic added successfully!", "success");
		this.resetAddTopicForm();
		this.updateDashboard();

		setTimeout(() => {
			this.switchView("dashboard");
		}, 1000);
	}

	resetAddTopicForm() {
		const form = document.getElementById("add-topic-form");
		if (form) {
			form.reset();
			this.updateSubcategoryFromSelected("add");
			// Clear additional categories checkboxes
			const addContainer = document.getElementById(
				"topic-additional-categories"
			);
			if (addContainer) {
				addContainer
					.querySelectorAll('input[type="checkbox"]')
					.forEach((cb) => (cb.checked = false));
			}
			// Clear subcategories checkboxes
			const subContainer = document.getElementById("topic-subcategories");
			if (subContainer) {
				subContainer.innerHTML = "";
			}
		}

		// Clear any alerts
		const existingAlerts = document.querySelectorAll(".alert");
		existingAlerts.forEach((alert) => {
			if (
				alert.textContent.includes("Category") ||
				alert.textContent.includes("Topic")
			) {
				alert.remove();
			}
		});
	}

	openEditModal(topicId) {
		const topic = this.topics.find((t) => t.id === topicId);
		if (!topic) {
			this.showAlert("Topic not found.", "error");
			return;
		}

		this.editingTopicId = topicId;

		// Populate edit form
		document.getElementById("edit-topic-id").value = topic.id;
		document.getElementById("edit-topic-name").value = topic.name;
		document.getElementById("edit-topic-description").value =
			topic.description || "";

		// Populate categories and checkboxes
		this.populateCategoryDropdowns();

		// Set additional categories selections based on topic.categories
		const editAdditionalContainer = document.getElementById(
			"edit-topic-additional-categories"
		);
		if (editAdditionalContainer) {
			const allCats =
				topic.categories && Array.isArray(topic.categories)
					? topic.categories
					: topic.category
					? [topic.category]
					: [];
			editAdditionalContainer
				.querySelectorAll('input[type="checkbox"]')
				.forEach((cb) => {
					cb.checked = allCats.includes(cb.value);
				});
			// Update subcategory based on single-selection rule
			this.updateSubcategoryFromSelected("edit");
			// Check subcategory checkboxes from topic
			const editSubContainer = document.getElementById(
				"edit-topic-subcategories"
			);
			if (editSubContainer) {
				const subs = Array.isArray(topic.subCategories)
					? topic.subCategories
					: topic.subCategory
					? [topic.subCategory]
					: [];
				editSubContainer
					.querySelectorAll('input[type="checkbox"]')
					.forEach((cb) => {
						cb.checked = subs.includes(cb.value);
					});
			}
		}

		// (primary vs additional no longer used; keep all checked as above)

		// Show modal
		const modal = document.getElementById("edit-topic-modal");
		if (modal) {
			modal.classList.remove("hidden");
		}
	}

	closeEditModal() {
		const modal = document.getElementById("edit-topic-modal");
		if (modal) {
			modal.classList.add("hidden");
		}

		this.editingTopicId = null;

		// Reset form
		const form = document.getElementById("edit-topic-form");
		if (form) {
			form.reset();
			this.updateSubcategoryFromSelected("edit");
			// Clear additional categories checkboxes
			const editContainer = document.getElementById(
				"edit-topic-additional-categories"
			);
			if (editContainer) {
				editContainer
					.querySelectorAll('input[type="checkbox"]')
					.forEach((cb) => (cb.checked = false));
			}
			const editSub = document.getElementById("edit-topic-subcategories");
			if (editSub) {
				editSub.innerHTML = "";
			}
		}
	}

	updateTopic() {
		if (!this.editingTopicId) {
			this.showAlert("No topic is being edited.", "error");
			return;
		}

		const form = document.getElementById("edit-topic-form");
		if (!form) {
			this.showAlert("Form not found.", "error");
			return;
		}

		const formData = new FormData(form);

		const name = formData.get("name")?.trim() || "";
		// Sub-categories via checkboxes
		const selectedSubCategories = Array.from(
			document.querySelectorAll(
				'#edit-topic-subcategories input[type="checkbox"]:checked'
			)
		).map((cb) => cb.value);
		const newSubCategoryName = formData.get("newSubcategory")?.trim() || "";
		const description = formData.get("description")?.trim() || "";
		// Get additional categories selections (checkboxes)
		const additionalCategories = Array.from(
			document.querySelectorAll(
				'#edit-topic-additional-categories input[type="checkbox"]:checked'
			)
		).map((cb) => cb.value);

		// Validate topic name
		if (!name) {
			this.showAlert("Topic name is required.", "error");
			return;
		}

		// Validate category selection via checkboxes
		if (!additionalCategories || additionalCategories.length === 0) {
			this.showAlert("Please select at least one category.", "error");
			return;
		}

		// Optional sub-categories (multi-select)
		let finalSubCategories = [...selectedSubCategories];

		// Check for duplicate topic names (excluding current topic)
		const exists = this.topics.some(
			(topic) =>
				topic.id !== this.editingTopicId &&
				topic.name.toLowerCase() === name.toLowerCase()
		);

		if (exists) {
			this.showAlert("A topic with this name already exists.", "error");
			return;
		}

		// Update topic
		const topicIndex = this.topics.findIndex(
			(t) => t.id === this.editingTopicId
		);
		if (topicIndex !== -1) {
			const categories = Array.from(new Set(additionalCategories));
			this.topics[topicIndex] = {
				...this.topics[topicIndex],
				name: name,
				category: categories[0] || "",
				categories: categories,
				subCategory: finalSubCategories[0] || "",
				subCategories: finalSubCategories,
				description: description,
			};

			this.saveToCloud();
			this.showAlert("Topic updated successfully!", "success");
			this.closeEditModal();
			this.updateDashboard();
		} else {
			this.showAlert("Topic not found.", "error");
		}
	}

	deleteTopic(topicId) {
		this.showConfirmDialog({
			title: "Delete Topic",
			message:
				"Are you sure you want to delete this topic? This action cannot be undone.",
			confirmText: "Delete",
			cancelText: "Cancel",
		}).then((ok) => {
			if (!ok) return;
			this.topics = this.topics.filter((topic) => topic.id !== topicId);
			this.saveToCloud();
			this.updateDashboard();
			this.showAlert("Topic deleted successfully!", "success");
		});
	}

	// Dashboard Management
	updateDashboard() {
		const filteredTopics = this.getFilteredTopics();
		const dueTopics = this.getDueItems(filteredTopics);

		// Update stats
		const totalTopicsEl = document.getElementById("total-topics");
		const dueTopicsEl = document.getElementById("due-topics");
		const completedTodayEl = document.getElementById("completed-today");

		if (totalTopicsEl) totalTopicsEl.textContent = filteredTopics.length;
		if (dueTopicsEl) dueTopicsEl.textContent = dueTopics.length;
		if (completedTodayEl)
			completedTodayEl.textContent = this.getCompletedToday();
		// Due in next 7 days
		const dueNext7El = document.getElementById("due-next-7");
		if (dueNext7El)
			dueNext7El.textContent = this.getDueInNextDays(
				7,
				filteredTopics
			).length;

		// Streaks
		const { currentStreak, longestStreak } = this.computeStreaks();
		const currentStreakEl = document.getElementById("current-streak");
		const longestStreakEl = document.getElementById("longest-streak");
		if (currentStreakEl) currentStreakEl.textContent = currentStreak;
		if (longestStreakEl) longestStreakEl.textContent = longestStreak;

		// Update review button
		const reviewBtn = document.getElementById("start-review-btn");
		if (reviewBtn) {
			let categoryText =
				this.selectedCategoryFilter === "all"
					? "All Categories"
					: this.selectedCategoryFilter;
			if (
				this.selectedCategoryFilter !== "all" &&
				this.selectedSubCategoryFilter !== "all"
			) {
				categoryText += ` > ${this.selectedSubCategoryFilter}`;
			}
			const itemsText = `${dueTopics.length} ${
				dueTopics.length === 1 ? "item" : "items"
			}`;
			reviewBtn.innerHTML = `Start Review Session<br>${this.escapeHtml(
				categoryText
			)} (${itemsText})`;
			reviewBtn.disabled = dueTopics.length === 0;
		}

		// Update topics list with search + sort
		const displayedTopics = this.applySearchAndSort(filteredTopics);
		this.renderTopicsList(displayedTopics);
		// Update analytics sections
		this.updateAnalyticsUI();
	}

	getFilteredTopics() {
		let filtered = this.topics;

		if (this.selectedCategoryFilter !== "all") {
			filtered = filtered.filter((topic) => {
				if (Array.isArray(topic.categories)) {
					return topic.categories.includes(
						this.selectedCategoryFilter
					);
				}
				return topic.category === this.selectedCategoryFilter;
			});
		}

		if (this.selectedSubCategoryFilter !== "all") {
			filtered = filtered.filter((topic) => {
				if (Array.isArray(topic.subCategories)) {
					return topic.subCategories.includes(
						this.selectedSubCategoryFilter
					);
				}
				return topic.subCategory === this.selectedSubCategoryFilter;
			});
		}

		// Apply overdue-days filter if set (supports >= or <=)
		if (
			this.overdueDaysFilter !== "" &&
			Number.isFinite(this.overdueDaysFilter)
		) {
			const today = this.getCurrentDate();
			const t = new Date(today);
			t.setHours(0, 0, 0, 0);
			const oneDay = 24 * 60 * 60 * 1000;
			filtered = filtered.filter((topic) => {
				if (!topic.nextReviewDate || topic.nextReviewDate >= today)
					return false;
				const n = new Date(topic.nextReviewDate);
				n.setHours(0, 0, 0, 0);
				const daysOverdue = Math.floor((t - n) / oneDay);
				if (this.overdueDaysOperator === "lte") {
					return daysOverdue <= this.overdueDaysFilter;
				}
				return daysOverdue >= this.overdueDaysFilter; // default gte
			});
		}

		return filtered;
	}

	applySearchAndSort(topics) {
		const q = (this.searchQuery || "").trim().toLowerCase();
		let list = topics;
		if (q) {
			list = list.filter((t) => {
				const fields = [
					t.name || "",
					t.description || "",
					Array.isArray(t.categories)
						? t.categories.join(" ")
						: t.category || "",
					Array.isArray(t.subCategories)
						? t.subCategories.join(" ")
						: t.subCategory || "",
				]
					.join(" ")
					.toLowerCase();
				return fields.includes(q);
			});
		}

		const option = this.sortOption || "next-asc";
		const toTime = (s) => {
			if (!s) return 0;
			const d = new Date(s);
			return isNaN(d) ? 0 : d.getTime();
		};
		const cmp = (a, b, dir = 1) => (a < b ? -1 * dir : a > b ? 1 * dir : 0);
		const byName = (a, b, dir) =>
			cmp(
				(a.name || "").toLowerCase(),
				(b.name || "").toLowerCase(),
				dir
			);
		const byNext = (a, b, dir) =>
			cmp(toTime(a.nextReviewDate), toTime(b.nextReviewDate), dir);
		const byAdded = (a, b, dir) =>
			cmp(toTime(a.dateAdded), toTime(b.dateAdded), dir);

		const sorted = [...list];
		switch (option) {
			case "name-asc":
				sorted.sort((a, b) => byName(a, b, 1));
				break;
			case "name-desc":
				sorted.sort((a, b) => byName(a, b, -1));
				break;
			case "next-desc":
				sorted.sort((a, b) => byNext(a, b, -1));
				break;
			case "added-asc":
				sorted.sort((a, b) => byAdded(a, b, 1));
				break;
			case "added-desc":
				sorted.sort((a, b) => byAdded(a, b, -1));
				break;
			case "next-asc":
			default:
				sorted.sort((a, b) => byNext(a, b, 1));
		}
		return sorted;
	}

	renderTopicsList(topics) {
		const container = document.getElementById("topics-list");
		if (!container) return;

		if (topics.length === 0) {
			let emptyMessage =
				"No topics found. Add your first topic to get started with spaced repetition learning.";
			if (this.selectedCategoryFilter !== "all") {
				emptyMessage = `No topics found in "${this.selectedCategoryFilter}"`;
				if (this.selectedSubCategoryFilter !== "all") {
					emptyMessage += ` > "${this.selectedSubCategoryFilter}"`;
				}
				emptyMessage += ".";
			}

			container.innerHTML = `
                <div class="empty-state">
                    <h3>No topics found</h3>
                    <p>${emptyMessage}</p>
                </div>
            `;
			return;
		}

		container.innerHTML = topics
			.map((topic) => {
				const dueStatus = this.getDueStatus(topic);
				const categories =
					Array.isArray(topic.categories) &&
					topic.categories.length > 0
						? topic.categories
						: topic.category
						? [topic.category]
						: [];
				const categoriesHtml = categories
					.map(
						(c) =>
							`<span class="status status--info">${this.escapeHtml(
								c
							)}</span>`
					)
					.join(" ");
				return `
                <div class="topic-item">
                    <div class="topic-header">
                        <h4 class="topic-name">${this.escapeHtml(
							topic.name
						)}</h4>
                        <div class="topic-actions">
                            <button class="btn btn--outline btn--sm" onclick="editTopic('${
								topic.id
							}')">Edit</button>
                            <button class="btn btn--outline btn--sm" onclick="deleteTopic('${
								topic.id
							}')">Delete</button>
                        </div>
                    </div>
                    <div class="topic-category">
                        ${categoriesHtml}
                        ${(() => {
							const subs =
								Array.isArray(topic.subCategories) &&
								topic.subCategories.length > 0
									? topic.subCategories
									: topic.subCategory
									? [topic.subCategory]
									: [];
							return subs.length
								? subs
										.map(
											(s) =>
												`<span class=\"status status--success\">${this.escapeHtml(
													s
												)}</span>`
										)
										.join(" ")
								: '<span class="status status--success">No Sub-Category</span>';
						})()}
                    </div>
                    <p class="topic-description">${this.escapeHtml(
						topic.description || "No description provided."
					)}</p>
                    <div class="topic-meta">
                        <span>Added: ${this.formatDate(topic.dateAdded)}</span>
                        <span class="topic-stats">Reps: ${Number(
							topic.repetitions || 0
						)}  EF: ${Number(topic.easeFactor || 0).toFixed(
					2
				)}</span>
                        <span class="topic-due-status ${dueStatus.class}">${
					dueStatus.text
				}</span>
                    </div>
                </div>
            `;
			})
			.join("");
	}

	getDueStatus(topic) {
		const today = this.getCurrentDate();
		const nextReview = topic.nextReviewDate;

		if (nextReview < today) {
			// Calculate how many days overdue
			const oneDay = 24 * 60 * 60 * 1000;
			const t = new Date(today);
			t.setHours(0, 0, 0, 0);
			const n = new Date(nextReview);
			n.setHours(0, 0, 0, 0);
			const days = Math.max(1, Math.floor((t - n) / oneDay));
			return {
				class: "overdue",
				text: `Overdue by ${days} day${days === 1 ? "" : "s"}`,
			};
		} else if (nextReview === today) {
			return { class: "due-today", text: "Due Today" };
		} else {
			return {
				class: "future",
				text: `Due ${this.formatDate(nextReview)}`,
			};
		}
	}

	// Review Session Management
	startReviewSession() {
		const filteredTopics = this.getFilteredTopics();
		const dueItems = this.getDueItems(filteredTopics);

		if (dueItems.length === 0) {
			this.showAlert("No topics are due for review right now!", "info");
			return;
		}

		this.reviewSession = {
			items: [...dueItems],
			currentIndex: 0,
			completed: [],
			startTime: Date.now(),
		};

		this.switchView("review");
		this.updateReviewInterface();
	}

	// Popup on load if there are items overdue by >= N days (default 7)
	checkOverduePopup(days = 7) {
		const count = this.countOverdueAtLeast(days, this.topics);
		if (count > 0) {
			const message = `${count} topic${
				count === 1 ? "" : "s"
			} overdue by ${days}+ day${count === 1 ? "" : "s"}.`;
			this.showChoiceDialog({
				title: "Overdue Reviews",
				message: message,
				primaryText: "Review All Due",
				secondaryText: "Later",
				tertiaryText: "Review Critical",
			}).then((choice) => {
				if (choice === "primary") {
					this.startReviewSession();
				} else if (choice === "tertiary") {
					const filteredTopics = this.getFilteredTopics();
					const dueItems = this.getDueItems(filteredTopics);
					const critical = dueItems.filter(
						(t) => this.daysOverdue(t) >= days
					);
					if (critical.length === 0) {
						this.showAlert("No critical topics found.", "info");
						return;
					}
					this.startReviewWithItems(critical);
				}
			});
		}
	}

	countOverdueAtLeast(days = 7, list = null) {
		const topics = list || this.topics;
		const today = this.getCurrentDate();
		const t = new Date(today);
		t.setHours(0, 0, 0, 0);
		const oneDay = 24 * 60 * 60 * 1000;
		let count = 0;
		for (const topic of topics) {
			if (!topic.nextReviewDate || topic.nextReviewDate >= today)
				continue;
			const n = new Date(topic.nextReviewDate);
			n.setHours(0, 0, 0, 0);
			const diff = Math.floor((t - n) / oneDay);
			if (diff >= days) count++;
		}
		return count;
	}

	daysOverdue(topic) {
		const today = this.getCurrentDate();
		if (!topic.nextReviewDate || topic.nextReviewDate >= today) return 0;
		const t = new Date(today);
		t.setHours(0, 0, 0, 0);
		const n = new Date(topic.nextReviewDate);
		n.setHours(0, 0, 0, 0);
		const oneDay = 24 * 60 * 60 * 1000;
		return Math.max(0, Math.floor((t - n) / oneDay));
	}

	startReviewWithItems(items) {
		if (!items || items.length === 0) {
			this.showAlert("No topics are due for review right now!", "info");
			return;
		}
		this.reviewSession = {
			items: [...items],
			currentIndex: 0,
			completed: [],
			startTime: Date.now(),
		};
		this.switchView("review");
		this.updateReviewInterface();
	}

	// Three-choice dialog using the existing confirm modal skeleton
	showChoiceDialog({
		title = "Choose",
		message = "",
		primaryText = "OK",
		secondaryText = "Cancel",
		tertiaryText = "Alt",
	} = {}) {
		return new Promise((resolve) => {
			const modal = document.getElementById("confirm-modal");
			const titleEl = document.getElementById("confirm-modal-title");
			const msgEl = document.getElementById("confirm-modal-message");
			const btnConfirm = document.getElementById("confirm-modal-confirm");
			const btnCancel = document.getElementById("confirm-modal-cancel");
			const btnClose = document.getElementById("confirm-modal-close");
			const actions = modal
				? modal.querySelector(".modal-actions")
				: null;

			if (
				!modal ||
				!titleEl ||
				!msgEl ||
				!btnConfirm ||
				!btnCancel ||
				!btnClose ||
				!actions
			) {
				const ok = window.confirm(message);
				resolve(ok ? "primary" : "secondary");
				return;
			}

			// Create tertiary button temporarily
			const btnTertiary = document.createElement("button");
			btnTertiary.className = "btn btn--primary";
			btnTertiary.textContent = tertiaryText;

			const cleanup = () => {
				modal.classList.add("hidden");
				btnConfirm.removeEventListener("click", onConfirm);
				btnCancel.removeEventListener("click", onCancel);
				btnClose.removeEventListener("click", onCancel);
				btnTertiary.removeEventListener("click", onTertiary);
				modal.removeEventListener("click", onBackdrop);
				document.removeEventListener("keydown", onKey);
				if (btnTertiary.parentNode)
					btnTertiary.parentNode.removeChild(btnTertiary);
			};
			const onConfirm = () => {
				cleanup();
				resolve("primary");
			};
			const onCancel = () => {
				cleanup();
				resolve("secondary");
			};
			const onTertiary = () => {
				cleanup();
				resolve("tertiary");
			};
			const onBackdrop = (e) => {
				if (e.target === modal) onCancel();
			};
			const onKey = (e) => {
				if (e.key === "Escape") onCancel();
				if (e.key === "Enter") onConfirm();
			};

			titleEl.textContent = title;
			msgEl.textContent = message;
			btnConfirm.textContent = primaryText;
			btnCancel.textContent = secondaryText;
			actions.appendChild(btnTertiary);

			btnConfirm.addEventListener("click", onConfirm);
			btnCancel.addEventListener("click", onCancel);
			btnClose.addEventListener("click", onCancel);
			btnTertiary.addEventListener("click", onTertiary);
			modal.addEventListener("click", onBackdrop);
			document.addEventListener("keydown", onKey);

			modal.classList.remove("hidden");
		});
	}

	getDueItems(topics = null) {
		const topicsToCheck = topics || this.topics;
		const today = this.getCurrentDate();
		return topicsToCheck.filter((topic) => topic.nextReviewDate <= today);
	}

	updateReviewInterface() {
		if (
			!this.reviewSession ||
			this.reviewSession.currentIndex >= this.reviewSession.items.length
		) {
			this.completeReviewSession();
			return;
		}

		const currentTopic =
			this.reviewSession.items[this.reviewSession.currentIndex];
		const progress =
			(this.reviewSession.currentIndex /
				this.reviewSession.items.length) *
			100;

		// Update progress
		const progressText = document.getElementById("review-progress-text");
		const progressFill = document.getElementById("progress-fill");

		if (progressText) {
			progressText.textContent = `Question ${
				this.reviewSession.currentIndex + 1
			} of ${this.reviewSession.items.length}`;
		}
		if (progressFill) {
			progressFill.style.width = `${progress}%`;
		}

		// Update topic info
		const categoryEl = document.getElementById("current-topic-category");
		const subcategoryEl = document.getElementById(
			"current-topic-subcategory"
		);
		const nameEl = document.getElementById("current-topic-name");
		const descEl = document.getElementById("current-topic-description");

		if (categoryEl) {
			const cats =
				Array.isArray(currentTopic.categories) &&
				currentTopic.categories.length > 0
					? currentTopic.categories.join(", ")
					: currentTopic.category || "";
			categoryEl.textContent = cats;
		}
		if (subcategoryEl) {
			const subs =
				Array.isArray(currentTopic.subCategories) &&
				currentTopic.subCategories.length > 0
					? currentTopic.subCategories.join(", ")
					: currentTopic.subCategory || "No Sub-Category";
			subcategoryEl.textContent = subs;
		}
		if (nameEl) nameEl.textContent = currentTopic.name;
		if (descEl)
			descEl.textContent =
				currentTopic.description || "No description provided.";

		// Populate and sync the question picker
		const questionPicker = document.getElementById("question-picker");
		if (questionPicker) {
			const completedIds = new Set(
				this.reviewSession.completed.map((c) => c.topic.id)
			);
			// Build options list: only remaining items are enabled; completed are shown but disabled
			questionPicker.innerHTML = "";
			const placeholder = document.createElement("option");
			placeholder.value = "";
			placeholder.textContent = "Pick question...";
			placeholder.disabled = true;
			questionPicker.appendChild(placeholder);

			this.reviewSession.items.forEach((item, idx) => {
				const opt = document.createElement("option");
				opt.value = item.id;
				const isCompleted = completedIds.has(item.id);
				const labelIdx = idx + 1;
				// Trim overly long names for compactness
				const name =
					item.name && item.name.length > 60
						? item.name.slice(0, 57) + "â€¦"
						: item.name || "Untitled";
				opt.textContent = `${labelIdx}. ${name}`;
				opt.disabled = isCompleted;
				questionPicker.appendChild(opt);
			});

			questionPicker.disabled = false;
			questionPicker.value = currentTopic.id;
		}
	}

	answerReview(difficulty) {
		if (!this.reviewSession) return;

		const currentTopic =
			this.reviewSession.items[this.reviewSession.currentIndex];
		const updatedTopic = this.updateTopicWithSM2(currentTopic, difficulty);

		// Update the topic in main topics array
		const topicIndex = this.topics.findIndex(
			(t) => t.id === updatedTopic.id
		);
		if (topicIndex !== -1) {
			this.topics[topicIndex] = updatedTopic;
		}

		this.reviewSession.completed.push({
			topic: updatedTopic,
			difficulty: difficulty,
		});

		this.reviewSession.currentIndex++;
		this.updateReviewInterface();
		// Log this answer for analytics and persist
		this.logReview(updatedTopic.id, difficulty);
		this.saveToCloud();
	}

	// SM-2 Spaced Repetition Algorithm
	updateTopicWithSM2(topic, quality) {
		const newTopic = { ...topic };

		if (quality >= 3) {
			if (newTopic.repetitions === 0) {
				newTopic.interval = 1;
			} else if (newTopic.repetitions === 1) {
				newTopic.interval = 6;
			} else {
				newTopic.interval = Math.round(
					newTopic.interval * newTopic.easeFactor
				);
			}
			newTopic.repetitions++;
		} else {
			newTopic.repetitions = 0;
			newTopic.interval = 1;
		}

		newTopic.easeFactor = Math.max(
			1.3,
			newTopic.easeFactor +
				(0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
		);

		const todayStr = this.getCurrentDate();
		newTopic.nextReviewDate = this.addDaysToDate(
			todayStr,
			newTopic.interval
		);
		newTopic.lastReviewedDate = todayStr;

		return newTopic;
	}

	completeReviewSession() {
		if (!this.reviewSession) return;

		const completedCount = this.reviewSession.completed.length;
		const averageDifficulty =
			completedCount > 0
				? (
						this.reviewSession.completed.reduce(
							(sum, item) => sum + item.difficulty,
							0
						) / completedCount
				  ).toFixed(1)
				: "-";

		const topicsReviewedEl = document.getElementById("topics-reviewed");
		const avgDifficultyEl = document.getElementById("average-difficulty");

		if (topicsReviewedEl) topicsReviewedEl.textContent = completedCount;
		if (avgDifficultyEl) avgDifficultyEl.textContent = averageDifficulty;

		this.reviewSession = null;
		this.updateDashboard();
		this.switchView("review-complete");
	}

	endReviewSession() {
		this.showConfirmDialog({
			title: "End Review Session",
			message:
				"Are you sure you want to end the review session? Your progress will be saved.",
			confirmText: "End Session",
			cancelText: "Continue Review",
		}).then((ok) => {
			if (!ok) return;
			this.completeReviewSession();
		});
	}

	// Analytics helpers
	logReview(topicId, difficulty) {
		const date = this.getCurrentDate();
		this.reviewLog.push({ date, topicId, difficulty });
	}

	getDueInNextDays(days = 7, topics = null) {
		const list = topics || this.topics;
		const today = this.getCurrentDate();
		const end = this.addDaysToDate(today, days);
		return list.filter(
			(t) =>
				t.nextReviewDate &&
				t.nextReviewDate > today &&
				t.nextReviewDate <= end
		);
	}

	computeStreaks() {
		if (!Array.isArray(this.reviewLog) || this.reviewLog.length === 0) {
			return { currentStreak: 0, longestStreak: 0 };
		}
		const counts = this.reviewLog.reduce((m, r) => {
			m[r.date] = (m[r.date] || 0) + 1;
			return m;
		}, {});
		const dates = Object.keys(counts).sort();
		const oneDay = 24 * 60 * 60 * 1000;
		const parse = (s) => {
			const d = new Date(s);
			d.setHours(0, 0, 0, 0);
			return d.getTime();
		};

		let longest = 0;
		let cur = 0;
		let prev = null;
		dates.forEach((s) => {
			const t = parse(s);
			if (prev !== null && t - prev === oneDay) {
				cur += 1;
			} else if (prev === null || t - prev > oneDay) {
				cur = 1;
			}
			longest = Math.max(longest, cur);
			prev = t;
		});

		let current = 0;
		const today = this.getCurrentDate();
		let tcur = parse(today);
		while (counts[this.formatYmdFromTime(tcur)]) {
			current += 1;
			tcur -= oneDay;
		}
		return { currentStreak: current, longestStreak: longest };
	}

	formatYmdFromTime(ms) {
		const d = new Date(ms);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${y}-${m}-${dd}`;
	}

	updateAnalyticsUI() {
		this.renderEfDistribution();
		this.renderIntervalDistribution();
		this.renderCalendarHeatmap();
	}

	renderEfDistribution() {
		const el = document.getElementById("ef-distribution");
		if (!el) return;
		const buckets = [
			{ label: "1.3-1.6", min: 1.3, max: 1.6 },
			{ label: "1.6-2.0", min: 1.6, max: 2.0 },
			{ label: "2.0-2.4", min: 2.0, max: 2.4 },
			{ label: "2.4-2.8", min: 2.4, max: 2.8 },
			{ label: "2.8-3.5", min: 2.8, max: 3.5 },
		];
		const counts = buckets.map((b) => ({
			label: b.label,
			count: this.topics.filter(
				(t) => t.easeFactor >= b.min && t.easeFactor < b.max
			).length,
		}));
		this.renderBarChart(el, counts);
	}

	renderIntervalDistribution() {
		const el = document.getElementById("interval-distribution");
		if (!el) return;
		const ranges = [
			{ label: "0", test: (x) => x === 0 },
			{ label: "1", test: (x) => x === 1 },
			{ label: "2-3", test: (x) => x >= 2 && x <= 3 },
			{ label: "4-7", test: (x) => x >= 4 && x <= 7 },
			{ label: "8-14", test: (x) => x >= 8 && x <= 14 },
			{ label: "15-30", test: (x) => x >= 15 && x <= 30 },
			{ label: "31-90", test: (x) => x >= 31 && x <= 90 },
			{ label: "90+", test: (x) => x > 90 },
		];
		const counts = ranges.map((r) => ({
			label: r.label,
			count: this.topics.filter((t) => r.test(Number(t.interval || 0)))
				.length,
		}));
		this.renderBarChart(el, counts);
	}

	renderBarChart(container, buckets) {
		container.innerHTML = "";
		const max = Math.max(1, ...buckets.map((b) => b.count));
		buckets.forEach((b) => {
			const row = document.createElement("div");
			row.className = "bar-row";
			const label = document.createElement("div");
			label.className = "bar-label";
			label.textContent = b.label;
			const barWrap = document.createElement("div");
			barWrap.className = "bar-wrap";
			const bar = document.createElement("div");
			bar.className = "bar-fill";
			bar.style.width = `${(b.count / max) * 100}%`;
			const count = document.createElement("div");
			count.className = "bar-count";
			count.textContent = String(b.count);
			barWrap.appendChild(bar);
			row.appendChild(label);
			row.appendChild(barWrap);
			row.appendChild(count);
			container.appendChild(row);
		});
	}

	renderCalendarHeatmap() {
		const container = document.getElementById("calendar-heatmap");
		if (!container) return;
		const weeks = 12; // last 12 weeks
		const days = weeks * 7;
		const today = new Date(this.getCurrentDate());
		today.setHours(0, 0, 0, 0);
		const start = new Date(today);
		start.setDate(start.getDate() - (days - 1));

		const countByDate = this.reviewLog.reduce((m, r) => {
			m[r.date] = (m[r.date] || 0) + 1;
			return m;
		}, {});

		const counts = Object.values(countByDate);
		const max = counts.length ? Math.max(...counts) : 0;

		container.innerHTML = "";
		container.style.setProperty("--weeks", weeks);

		for (let i = 0; i < days; i++) {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
				2,
				"0"
			)}-${String(d.getDate()).padStart(2, "0")}`;
			const c = countByDate[iso] || 0;

			const cell = document.createElement("div");
			cell.className = `heatmap-cell level-${this.heatmapLevel(c, max)}`;
			cell.title = `${iso}: ${c} review${c === 1 ? "" : "s"}`;
			container.appendChild(cell);
		}
	}

	heatmapLevel(count, max) {
		if (count <= 0) return 0;
		if (max <= 1) return 1;
		const r = count / max;
		if (r < 0.25) return 1;
		if (r < 0.5) return 2;
		if (r < 0.75) return 3;
		return 4;
	}
	// Utility Functions
	initTheme() {
		const stored = localStorage.getItem("dsaTool_theme");
		let theme =
			stored ||
			(window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light");
		this.applyTheme(theme);
	}

	applyTheme(theme) {
		document.documentElement.setAttribute("data-color-scheme", theme);
		localStorage.setItem("dsaTool_theme", theme);
		const btn = document.getElementById("theme-toggle");
		if (btn) {
			const isDark = theme === "dark";
			btn.setAttribute("aria-pressed", String(isDark));
			btn.textContent = isDark ? "ðŸŒ™" : "ðŸŒž";
			btn.setAttribute(
				"aria-label",
				isDark ? "Switch to light mode" : "Switch to dark mode"
			);
		}
	}

	toggleTheme() {
		const current =
			document.documentElement.getAttribute("data-color-scheme") ||
			"light";
		const next = current === "dark" ? "light" : "dark";
		this.applyTheme(next);
	}

	getCurrentDate() {
		// Local, timezone-safe YYYY-MM-DD (avoids UTC off-by-one issues)
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		return `${y}-${m}-${day}`;
	}

	addDaysToDate(dateString, days) {
		// Interprets the input as a local date and adds days locally
		const [y, m, d] = dateString.split("-").map(Number);
		const date = new Date(y, (m || 1) - 1, d || 1);
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() + days);
		const yy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yy}-${mm}-${dd}`;
	}

	formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	getCompletedToday() {
		const today = this.getCurrentDate();
		return this.topics.filter((topic) => topic.lastReviewedDate === today)
			.length;
	}

	escapeHtml(text) {
		if (!text) return "";
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}

	showAlert(message, type = "info") {
		// Create or find a top-right toast stack
		let stack = document.getElementById("toast-container");
		if (!stack) {
			stack = document.createElement("div");
			stack.id = "toast-container";
			document.body.appendChild(stack);
		}

		// Optionally dedupe by same text+type to prevent spam
		const existing = Array.from(
			stack.querySelectorAll(`.alert.alert--${type}`)
		).find((a) => a.textContent === message);
		if (existing) {
			// refresh its timer by removing and re-adding
			existing.remove();
		}

		const alert = document.createElement("div");
		alert.className = `alert alert--${type}`;
		alert.setAttribute("role", "alert");
		alert.textContent = message;
		stack.appendChild(alert);

		// Auto-remove after 5 seconds
		setTimeout(() => {
			if (alert.parentNode) {
				alert.remove();
			}
		}, 5000);
	}
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	new DSASpacedRepetitionTool();
});
