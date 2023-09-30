import { useState } from "react";

const initialFriends = [
	{
		id: 118836,
		name: "Clark",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Sarah",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

function Button({ children, onClick }) {
	return (
		<button className="button" onClick={onClick}>
			{children}
		</button>
	);
}

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend((showAddFriend) => !showAddFriend);
	}

	function handleAddFriend(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}

	function handleSelection(friend) {
		// setSelectedFriend(friend);
		setSelectedFriend((curruntlySelected) =>
			curruntlySelected?.id === friend.id ? null : friend
		);
		setShowAddFriend(false);
	}

	function handleBilling(value) {
		console.log(value);
		setFriends(
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
		setSelectedFriend(null);
	}
	return (
		<div className="app">
			<div className="sidebar">
				<FriendsList
					friends={friends}
					onSelectFriend={handleSelection}
					selectedFriend={selectedFriend}
				/>

				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? "Close" : "Add Friend"}
				</Button>
			</div>
			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onBilling={handleBilling}
				/>
			)}
		</div>
	);
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
	// const friends = initialFriends;
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelectFriend={onSelectFriend}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
	const isSelected = friend.id === selectedFriend?.id;
	return (
		<li className={isSelected ? "selected" : ""}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} {Math.abs(friend.balance)}€
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					{friend.name} owes you {Math.abs(friend.balance)}€
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}
			<Button onClick={() => onSelectFriend(friend)}>
				{isSelected ? "Close" : "Select"}
			</Button>
		</li>
	);
}
function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");
	function handleSubmit(e) {
		e.preventDefault();
		const id = crypto.randomUUID();
		if (!name || !image) return;
		const newFriend = {
			name,
			image: `${image}?=${id}`,
			id,
			balance: 0,
		};

		onAddFriend(newFriend);
		setName("");
		setImage("https://i.pravatar.cc/48");
	}
	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label>Friend Name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<label>🎆 Image Url</label>
			<input
				type="text"
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>

			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onBilling }) {
	const [bill, setBill] = useState("");
	const [paidByUser, setPaidByUser] = useState("");
	const paidByFriend = bill ? bill - paidByUser : "";
	// if (bill < paidByUser) {
	// 	paidByFriend = "";
	// }
	const [whoIsPaying, setWhoIsPaying] = useState("user");

	function handleSubmit(e) {
		e.preventDefault();
		if (!bill || !paidByUser) return;
		onBilling(whoIsPaying === "user" ? paidByFriend : -paidByUser);
	}
	return (
		<form className="form-split-bill " onSubmit={handleSubmit}>
			<h2>Spilt bill with {selectedFriend.name}</h2>

			<label> 💸 Bill Value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) => setBill(Number(e.target.value))}
			/>

			<label>🙅 Your Expense</label>
			<input
				type="text"
				value={paidByUser}
				onChange={(e) =>
					setPaidByUser(
						Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
					)
				}
			/>

			<label>🙅 {selectedFriend.name}'s Expense</label>
			<input type="text" disabled value={paidByFriend} />
			<label>🤑 Who's gonna pay the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value={selectedFriend.name}>{selectedFriend.name}</option>
			</select>

			<Button>Split Bill</Button>
		</form>
	);
}
