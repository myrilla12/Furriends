import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import { createClient as componentCreateClient } from '@/utils/supabase/component';
import { Burger, Button, Drawer, Flex, em } from '@mantine/core';
import FeedLinks from '@/components/feed/feedLinks';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { SetStateAction, useEffect, useState } from 'react';
import PostCreationModal from '@/components/feed/postCreationModal';
import Feed from '@/components/feed/feed';
import { Community, Post } from '@/utils/definitions';
import Communities from '@/components/feed/communities';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

type FeedPageProps = {
    user: User;
    posts: Post[];
    myCommunities: Community[];
    otherCommunities: Community[];
}

/**
 * Page component for displaying the feed.
 *
 * @param {FeedPageProps} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @param {Post[]} props.posts - The community feed post data. 
 * @param {Community[]} props.myCommunities - Communities that the user is a member of. 
 * @param {Community[]} props.otherCommunities - Communities that the user is not a member of. 
 * @returns {JSX.Element} The FeedPage component.
 */
export default function FeedPage({ user, posts, myCommunities, otherCommunities }: FeedPageProps) {
    const supabase = componentCreateClient();
    const [opened, setOpened] = useState(false);
    const [feed, setFeed] = useState<Post[]>(posts);
    const [myCommunitiesState, setMyCommunities] = useState<Community[]>(myCommunities);
    const [otherCommunitiesState, setOtherCommunities] = useState<Community[]>(otherCommunities);
    const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
    const isMobile = useMediaQuery(`(max-width: ${em(1050)})`);
    const [communityOpened, { open, close }] = useDisclosure(false);

    // make changes to 'community_posts' table realtime
    useEffect(() => {

        const communityPostsChannel = supabase
            .channel('community-posts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'community_posts',
                },
                (payload) => {
                    const eventType = payload.eventType;
                    
                    // if new post is inserted, add it to feed
                    if (eventType === 'INSERT') {
                        const newPost = payload.new as Post;
                        setFeed((prevPosts) => [newPost, ...prevPosts]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(communityPostsChannel);
        };
    }, [supabase])

    /**
     * Adds user as member of the community.
     *
     * @async
     * @param {string} id - The community id of the community being joined.
     */
    const joinCommunity = async (id: string) => {
        const { error: communityUserError } = await supabase
            .from('community_users')
            .insert({ community_id: id, user_id: user.id });

        if (communityUserError) {
            console.error('Error inserting community member: ', communityUserError);
        } else {
            const community = otherCommunitiesState.find(c => c.id === id);
            if (community) {
                setOtherCommunities(prev => prev.filter(c => c.id !== id));
                setMyCommunities(prev => [community, ...prev]);
            }
        }
    };

    /**
     * Removes user as member of the community.
     *
     * @async
     * @param {string} id - The community id of the community being left.
     */
    const leaveCommunity = async (id: string) => {
        const { error: removeError } = await supabase
            .from('community_users')
            .delete()
            .match({ community_id: id, user_id: user.id });

        if (removeError) {
            console.error('Error removing community member: ', removeError);
        } else {
            const community = myCommunitiesState.find(c => c.id === id);
            if (community) {
                setMyCommunities(prev => prev.filter(c => c.id !== id));
                setOtherCommunities(prev => [...prev, community]);
            }
        }
    };

    /**
     * Updates MyCommunities state upon adding new community.
     *
     * @param {Community} community - The community being added.
     */
    const addNewCommunity = (community: Community) => {
        setMyCommunities(prev => [...prev, community]);
    };

    /**
     * Updates feed to show community posts upon clicking one of 'My Communities' and save current community.
     *
     * @param {SetStateAction<Post[]>} fetchedPosts - The posts belonging to the community.
     */
    const handleCommunityPosts = (fetchedPosts: SetStateAction<Post[]>, currentCommunity: Community) => {
        setFeed(fetchedPosts);
        setCurrentCommunity(currentCommunity);
    }

    /**
     * Updates feed to general feed upon clicking return to general feed.
     *
     */
    const returnToGeneralFeed = () => {
        setFeed(posts);
        setCurrentCommunity(null);
    }

    const renderMobileVersion = () => (
        <div className='relative flex-grow p-6'>
            <FeedLinks />
            <Flex direction="row" align="center" wrap="wrap" style={{ justifyContent: 'space-between', width: '100%' }} className="mb-3">
                <div>
                    <h1 className="mt-7 text-2xl font-bold text-amber-950">Feed</h1>
                    <h2>Share your pet adventures</h2>
                </div>
                <Button 
                    leftSection={<PlusCircleIcon className='w-6'/>}  
                    size='md' 
                    variant='light' 
                    color='#6d543e' 
                    radius='md'
                    onClick={() => setOpened(true)}
                >
                    Create a post
                </Button>
                <PostCreationModal user={user} opened={opened} setOpened={setOpened} service={false} myCommunities={myCommunitiesState}/>
            </Flex>

            <Flex direction="row" align="center" gap="md" mb="sm">
                <p className='text-xl font-bold mb-1'>Open community list</p>
                <Burger opened={communityOpened} onClick={communityOpened ? close : open} aria-label="Toggle navigation" />

                <Drawer
                    opened={communityOpened}
                    onClose={close}
                    size="100%"
                    className="justify-center"
                >
                    <Flex direction="column" justify="center" align="center">
                    <Communities user={user} communities={myCommunitiesState} mine={true} joinCommunity={joinCommunity} leaveCommunity={leaveCommunity} addNewCommunity={addNewCommunity} handleCommunityPosts={handleCommunityPosts}/>
                    <Communities user={user} communities={otherCommunitiesState} mine={false} joinCommunity={joinCommunity} leaveCommunity={leaveCommunity} addNewCommunity={addNewCommunity} handleCommunityPosts={handleCommunityPosts}/>
                    </Flex>
                </Drawer>
            </Flex>
            
            <Feed user={user} posts={feed} service={false} community={currentCommunity} returnToGeneralFeed={returnToGeneralFeed}/>
        </div>
    );
    
    return (
        <Layout user={user}>
            {isMobile ?
                renderMobileVersion() :
                <div className='relative flex-grow p-6'>
                    <FeedLinks />
                    <div className="absolute top-1 right-1">
                        <Button 
                            leftSection={<PlusCircleIcon className='w-6'/>} 
                            m='md' 
                            size='md' 
                            variant='light' 
                            color='#6d543e' 
                            radius='md'
                            onClick={() => setOpened(true)}
                        >
                            Create a post
                        </Button>
                    </div>
                    <PostCreationModal user={user} opened={opened} setOpened={setOpened} service={false} myCommunities={myCommunitiesState}/>
                    <Flex direction="row">
                        <div>
                            <h1 className="mt-7 text-2xl font-bold text-amber-950">Feed</h1>
                            <h2 className="mb-7">Share your pet adventures</h2>
                            <Communities user={user} communities={myCommunitiesState} mine={true} joinCommunity={joinCommunity} leaveCommunity={leaveCommunity} addNewCommunity={addNewCommunity} handleCommunityPosts={handleCommunityPosts}/>
                            <Communities user={user} communities={otherCommunitiesState} mine={false} joinCommunity={joinCommunity} leaveCommunity={leaveCommunity} addNewCommunity={addNewCommunity} handleCommunityPosts={handleCommunityPosts}/>
                        </div>
                        <Feed user={user} posts={feed} service={false} community={currentCommunity} returnToGeneralFeed={returnToGeneralFeed}/>
                    </Flex>
                </div>
            }
        </Layout >
    )
}

/**
 * Server-side function to handle user authentication and fetch user data.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{redirect?: {destination: string, permanent: boolean}, props?: {user: User}}>} The redirection object for unauthenticated users or the user data for authenticated users.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data, error } = await supabase.auth.getUser()

    // prevent access by unauthenticated users
    if (error || !data) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // get general community posts
    const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .is('community_id', null)
        .order('created_at', { ascending: false });

    if (postError) {
        console.error('Error fetching post data', postError);
    }

    // get 'My communities' 
    const { data: CommunityIdsData, error: CommunityIdsError } = await supabase
        .from('community_users')
        .select(`community_id`)
        .eq('user_id', data.user.id);
    
    if (CommunityIdsError) {
        console.error("Error fetching my community ids: ", CommunityIdsError);
    }

    const ids = CommunityIdsData.map((community : { community_id: string; }) => community.community_id);

    const { data: CommunityData, error: CommunityError } = await supabase
        .from('communities')
        .select('*')
        .in('id', ids)
        .order('updated_at', { ascending: false });

    if (CommunityError) {
        console.error("Error fetching my community information: ", CommunityError);
    }

    // get 'Discover communities'
    const { data: allCommunityIdsData, error: allCommunityIdsError } = await supabase
        .from('communities')
        .select(`id`);
    
    if (allCommunityIdsError) {
        console.error("Error fetching all community ids: ", allCommunityIdsError);
    }

    const allIds = allCommunityIdsData.map((community : { id: string; }) => community.id);
    const otherIds = allIds.filter((id: string) => !ids.includes(id));

    const { data: otherCommunityData, error: otherCommunityError } = await supabase
        .from('communities')
        .select('*')
        .in('id', otherIds)
        .order('updated_at', { ascending: false });

    if (otherCommunityError) {
        console.error("Error fetching other communities information: ", otherCommunityError);
    }

    return {
        props: {
            user: data.user,
            posts: postData,
            myCommunities: CommunityData,
            otherCommunities: otherCommunityData,
        },
    }
}