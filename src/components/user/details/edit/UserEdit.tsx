import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ModalTitle from '../../../utilsComponents/modal/ModalTitle';
import ModalContent from '../../../utilsComponents/modal/ModalContent';
import shortid from 'shortid';
import useStyles from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { activityOptions } from '../../../../utils/activityLevels/activityLevels';
import { createUser, calculateDailyNeed } from '../../../../store/user/User.actions';
import {
	getUserName,
	getUserHeight,
	getUserWeight,
	getUserAge,
	getUserGender,
	getUserActivityLevel
} from '../../../../store/user/User.selectors';

interface UserEditProps {
	handleClose: () => void;
	openEditModal: boolean;
	setOpenEditModal: (open: boolean) => void;
	setDisplayAlert: (displayAlert: boolean) => void;
}

const UserEdit: React.FC<UserEditProps> = (props: UserEditProps): JSX.Element => {
	const { handleClose, openEditModal, setOpenEditModal, setDisplayAlert } = props;
	const classes = useStyles();
	const dispatch = useDispatch();

	const currentName = useSelector(getUserName);
	const [ name, setName ] = React.useState(currentName);
	const currentHeight = useSelector(getUserHeight);
	const [ height, setHeight ] = React.useState(currentHeight);
	const currentWeight = useSelector(getUserWeight);
	const [ weight, setWeight ] = React.useState(currentWeight);
	const currentAge = useSelector(getUserAge);
	const [ age, setAge ] = React.useState(currentAge);
	const currentGender = useSelector(getUserGender);
	const [ gender, setGender ] = React.useState(currentGender);
	const currentActivityLevel = useSelector(getUserActivityLevel);
	const [ activityLevel, setActivityLevel ] = React.useState(currentActivityLevel);

	const handleActivityLevelChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
		setActivityLevel((event.target as HTMLInputElement).value);
	};

	const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setGender((event.target as HTMLInputElement).value);
	};

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		dispatch(createUser({ name, height, weight, age, gender, activityLevel }));
		dispatch(calculateDailyNeed({ height, weight, age, gender, activityLevel }));
		setOpenEditModal(false);

		if (
			name !== currentName ||
			height !== currentHeight ||
			weight !== currentWeight ||
			age !== currentAge ||
			gender !== currentGender ||
			activityLevel !== currentActivityLevel
		) {
			setDisplayAlert(true);
		}
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={openEditModal}>
			<ModalTitle id='customized-dialog-title' onClose={handleClose}>
				Edit user data
			</ModalTitle>

			<form onSubmit={handleSubmit}>
				<ModalContent dividers>
					<TextField
						variant='outlined'
						fullWidth
						id='name'
						name='name'
						label='Name'
						autoComplete='name'
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						id='height'
						name='height'
						label='Height (inches)'
						autoComplete='height'
						type='number'
						onChange={(e) => setHeight(e.target.value)}
						value={height}
					/>
					<TextField
						variant='outlined'
						fullWidth
						id='weight'
						name='weight'
						label='Weight (lbs)'
						autoComplete='weight'
						type='number'
						onChange={(e) => setWeight(e.target.value)}
						value={weight}
					/>
					<TextField
						variant='outlined'
						fullWidth
						id='age'
						name='age'
						label='Age (years)'
						autoComplete='age'
						type='number'
						onChange={(e) => setAge(e.target.value)}
						value={age}
					/>
					<FormControl variant='outlined' className={classes.activity}>
						<InputLabel id='demo-simple-select-outlined-label'>Activity level</InputLabel>
						<Select
							labelId='demo-simple-select-outlined-label'
							id='demo-simple-select-outlined'
							value={activityLevel}
							displayEmpty
							onChange={handleActivityLevelChange}
							label='Activity level'
						>
							{activityOptions.map((element) => {
								return (
									<MenuItem value={element.activityValue} key={shortid.generate()}>
										{element.activityDescription}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
					<FormControl component='fieldset'>
						<RadioGroup aria-label='gender' name='gender1' value={gender} onChange={handleGenderChange}>
							<FormControlLabel value='male' control={<Radio />} label='Male' />
							<FormControlLabel value='female' control={<Radio />} label='Female' />
						</RadioGroup>
					</FormControl>
				</ModalContent>

				<div className={classes.buttons}>
					<Button autoFocus type='submit' color='primary'>
						Save
					</Button>
				</div>
			</form>
		</Dialog>
	);
};

export default UserEdit;
