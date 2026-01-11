import { LightMode, Close, SettingsBrightness, DarkMode, Help, MenuRounded } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Divider,
    Drawer,
    Stack,
    Switch,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { CSSProperties } from '@mui/material/styles/createTypography';
import { usePostHog } from 'posthog-js/react';
import { useCallback, useState } from 'react';

import { About } from './About';

import actionTypesStore from '$actions/ActionTypesStore';
import { autoSaveSchedule } from '$actions/AppStoreActions';
import { getLocalStorageUserId } from '$lib/localStorage';
import appStore from '$stores/AppStore';
import { useCoursePaneStore } from '$stores/CoursePaneStore';
import { scheduleComponentsToggleStore } from '$stores/ScheduleComponentsToggleStore';
import { useSessionStore } from '$stores/SessionStore';
import { usePreviewStore, useThemeStore, useTimeFormatStore, useAutoSaveStore } from '$stores/SettingsStore';
import { User } from '@packages/antalmanac-types';

const lightSelectedStyle: CSSProperties = {
    backgroundColor: '#1976d2', // MUI primary main color
    color: '#fff',
};

const darkSelectedStyle: CSSProperties = {
    backgroundColor: '#1976d2', // Same as light - uses primary color
    color: '#fff',
};

const lightUnselectedStyle: CSSProperties = {
    backgroundColor: '#f8f9fa',
    color: 'inherit',
};

const darkUnselectedStyle: CSSProperties = {
    backgroundColor: 'transparent', // PeterPortal doesn't set a background for dark unselected
    color: 'inherit',
};


function getSelectedStyle(buttonValue: string, themeSetting: string, isDark: boolean): CSSProperties {
    if (themeSetting === buttonValue) {
        return isDark ? darkSelectedStyle : lightSelectedStyle;
    } else {
        return isDark ? darkUnselectedStyle : lightUnselectedStyle;
    }
}

function ThemeMenu() {
    const [themeSetting, isDark, setTheme] = useThemeStore((store) => [
        store.themeSetting,
        store.isDark,
        store.setAppTheme,
    ]);
    const { forceUpdate } = useCoursePaneStore();
    const postHog = usePostHog();

    const handleThemeChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        forceUpdate();
        setTheme(event.currentTarget.value as 'light' | 'dark' | 'system', postHog);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                Theme
            </Typography>

            <ButtonGroup
                sx={{
                    width: '100%',
                    marginBottom: '12px',
                    display: 'flex',
                    border: `1px solid ${isDark ? '#8886' : '#d3d4d5'}`,
                    '& .MuiButtonGroup-grouped': {
                        border: 'none',
                        '&:not(:last-of-type)': {
                            borderRight: `1px solid ${isDark ? '#8886' : '#d3d4d5'} !important`,
                        },
                    },
                    '& .MuiButton-root': {
                        borderTop: 'none !important',
                        borderBottom: 'none !important',
                        borderLeft: 'none !important',
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                        '&:focus-visible': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                        '&:active': {
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                        },
                        '&.Mui-focusVisible': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                    },
                }}
            >
                {[
                    { value: 'light', label: 'Light', icon: <LightMode fontSize="medium" /> },
                    { value: 'system', label: 'System', icon: <SettingsBrightness fontSize="medium" /> },
                    { value: 'dark', label: 'Dark', icon: <DarkMode fontSize="small" /> },
                ].map((tab) => {
                    const isSelected = themeSetting === tab.value;

                    return (
                        <Button
                            key={tab.value}
                            startIcon={tab.icon}
                            disableRipple
                            sx={{
                                padding: '6px 20px',
                                width: '100%',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                backgroundColor: isSelected ? '#1976d2' : isDark ? '#333333' : '#f8f9fa',
                                color: isSelected ? '#fff' : '#1976d2',
                                outline: 'none',
                                boxShadow: 'none',
                                fontSize: '1.1rem',
                                border: 'none !important',
                                '&:hover': {
                                    backgroundColor: isSelected ? '#1976d2' : isDark ? '#424649' : '#d3d4d5',
                                    border: 'none !important',
                                    boxShadow: 'none',
                                },
                                '&:active': {
                                    border: 'none !important',
                                },
                            }}
                            value={tab.value}
                            onClick={handleThemeChange}
                        >
                            {tab.label}
                        </Button>
                    );
                })}
            </ButtonGroup>
        </Box>
    );
}


function TimeMenu() {
    const [isMilitaryTime, setTimeFormat] = useTimeFormatStore((store) => [store.isMilitaryTime, store.setTimeFormat]);
    const isDark = useThemeStore((store) => store.isDark);

    const handleTimeFormatChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setTimeFormat(event.currentTarget.value === 'true');
    };

    return (
        <Box sx={{ padding : '0.5rem 0rem 0rem 0rem', width: '100%' }}>
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                Time
            </Typography>

            <ButtonGroup
                sx={{
                    width: '100%',
                    marginBottom: '12px',
                    display: 'flex',
                    border: `1px solid ${isDark ? '#8886' : '#d3d4d5'}`,
                    '& .MuiButtonGroup-grouped': {
                        border: 'none',
                        '&:not(:last-of-type)': {
                            borderRight: `1px solid ${isDark ? '#8886' : '#d3d4d5'} !important`,
                        },
                    },
                    '& .MuiButton-root': {
                        borderTop: 'none !important',
                        borderBottom: 'none !important',
                        borderLeft: 'none !important',
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                        '&:focus-visible': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                        '&:active': {
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                        },
                        '&.Mui-focusVisible': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                    },
                }}
            >
                {[
                    { value: 'false', label: '12 Hour' },
                    { value: 'true', label: '24 Hour' },
                ].map((tab) => {
                    const isSelected = isMilitaryTime.toString() === tab.value;

                    return (
                        <Button
                            key={tab.value}
                            disableRipple
                            sx={{
                                padding: '6px 20px',
                                width: '100%',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                backgroundColor: isSelected ? '#1976d2' : isDark ? '#333333' : '#f8f9fa',
                                color: isSelected ? '#fff' : '#1976d2',
                                outline: 'none',
                                boxShadow: 'none',
                                fontSize: '1.1rem',
                                border: 'none !important',
                                '&:hover': {
                                    backgroundColor: isSelected ? '#1976d2' : isDark ? '#424649' : '#d3d4d5',
                                    border: 'none !important',
                                    boxShadow: 'none',
                                },
                                '&:active': {
                                    border: 'none !important',
                                },
                            }}
                            value={tab.value}
                            onClick={handleTimeFormatChange}
                        >
                            {tab.label}
                        </Button>
                    );
                })}
            </ButtonGroup>
        </Box>
    );
}


function ExperimentalMenu() {
    const [previewMode, setPreviewMode] = usePreviewStore((store) => [store.previewMode, store.setPreviewMode]);
    const [autoSave, setAutoSave] = useAutoSaveStore((store) => [store.autoSave, store.setAutoSave]);
    const { sessionIsValid, session } = useSessionStore();
    const { setOpenAutoSaveWarning } = scheduleComponentsToggleStore();

    const postHog = usePostHog();

    const handlePreviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPreviewMode(event.target.checked);
    };

    const handleAutoSaveChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoSave(event.target.checked);

        if (!event.target.checked) return;

        if (!sessionIsValid || !session) {
            setOpenAutoSaveWarning(true);
            return;
        }

        const savedUserID = getLocalStorageUserId();

        if (!savedUserID) return;
        actionTypesStore.emit('autoSaveStart');
        await autoSaveSchedule(savedUserID, postHog);
        appStore.unsavedChanges = false;
        actionTypesStore.emit('autoSaveEnd');
    };

    return (
        <Stack sx={{ width: '100%', display: 'flex', alignItems: 'middle' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', width: '1' }}>
                <Box style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                        Hover to Preview
                    </Typography>
                    <Tooltip title={<Typography>Hover over courses to preview them in your calendar!</Typography>}>
                        <Help />
                    </Tooltip>
                </Box>
                <Switch color={'primary'} value={previewMode} checked={previewMode} onChange={handlePreviewChange} />
            </Box>

            <Box style={{ display: 'flex', justifyContent: 'space-between', width: '1' }}>
                <Box style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                        Auto Save
                    </Typography>
                    <Tooltip title={<Typography>Auto Save your schedule!</Typography>}>
                        <Help />
                    </Tooltip>
                </Box>
                <Switch color={'primary'} value={autoSave} checked={autoSave} onChange={handleAutoSaveChange} />
            </Box>
        </Stack>
    );
}

function UserProfileSection({ user }: { user: User | null }) {
    if (!user) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
                src={user.avatar ?? '/default-avatar.png'}
                alt={user.name ?? 'User'}
                sx={{ width: 50, height: 50 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    style={{
                        fontSize: '18px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        paddingBottom: '8px',
                        margin: 0,
                        lineHeight: 1,
                    }}
                >
                    {user.name}
                </Typography>
                <Typography
                    style={{
                        fontSize: '14px',
                        color: '#606166',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        paddingBottom: '4px',
                        margin: 0,
                        lineHeight: 1,
                    }}
                >
                    {user.email}
                </Typography>
            </Box>
        </Box>
    );
}

export function SettingsMenu({ user }: { user: User | null }) {
    return (
        <Box>
            <UserProfileSection user={user} />
            <ThemeMenu />

            <Divider style={{ marginTop: '16px' }}>
                <Typography variant="subtitle2">Experimental Features</Typography>
            </Divider>
            <TimeMenu />

            <ExperimentalMenu />
        </Box>
    );
}

function AppDrawer() {}

export default AppDrawer;
